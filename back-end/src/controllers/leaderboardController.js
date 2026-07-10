const User = require("../../db/schemas/User");
const { calculatePortfolio } = require("../services/portfolioService");

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

module.exports = {
    getLeaderboard
};