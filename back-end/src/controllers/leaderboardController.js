const User = require("../../db/schemas/User");
const { calculatePortfolio } = require("../services/portfolioService");
const Market  = require("../../db/schemas/Market");

const getLeaderboard = async ( req,resp ) => {
    try{

        const users = await User.find({});

        const leaderboard = await Promise.all(
            users.map(async (user) => {
                const portfolio = await calculatePortfolio(user._id);

                return {
                    _id:user._id,
                    name: user.name,
                    totalProfitLoss: portfolio.totalProfitLoss,
                    totalInvested: portfolio.totalInvested,
                    totalCurrentValue: portfolio.totalCurrentValue
                };
            })
        );

        leaderboard.sort(
            (a,b) => 
                b.totalProfitLoss -
                a.totalProfitLoss
        );

        const ranked = leaderboard.map((user,index) => ({
            rank: index+1,
            ...user
        }));

        const currentUser = ranked.find(
            (user) => user._id.toString() === req.user.id
        );

        return resp.status(200).json({
            leaderboard:ranked,
            currentUser 
        });

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to fetch leaderboard."
        });
    }
};

const getTopCreators = async (req,resp) => {
    try{
        const admins = await User.find({role: "ADMIN"});

        const creators = await Promise.all(
            admins.map(async (admin) => {
                const totalMarket = await Market.countDocuments({
                    createdBy:admin._id
                });

                const totalVolume = await Market.aggregate([
                    {
                        $match:{
                            createdBy: admin._id
                        }
                    },{
                        $group: {
                            _id: null,
                            volume:{
                                $sum: "$totalVolume"
                            }
                        }
                    }
                ]);

                return {
                    name: admin.name,
                    totalMarket,
                    totalVolume:
                        totalVolume.length > 0
                            ? totalVolume[0].volume
                            : 0
                };
            })
        );

        creators.sort((a,b) => b.totalVolume - a.totalVolume);

        resp.json(
            creators.map((creator,index) => ({
                rank: index + 1,
                ...creator
            }))
        );
    }catch(error){
        console.error(error);
        resp.status(500).json({
            message: "Failed to fetch creators"
        });
    }
};

module.exports = {
    getLeaderboard,
    getTopCreators
};