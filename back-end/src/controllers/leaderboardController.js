const User = require("../../db/schemas/User");
const Admin = require("../../db/schemas/Admin");
const { calculatePortfolio } = require("../services/portfolioService");
const Market  = require("../../db/schemas/Market");

const getLeaderboard = async ( req,resp ) => {
    try{

        const users = await User.find({role: "USER"});

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

const getTopCreators = async (req, resp) => {
    try {
        const adminsFromAdminSchema = await Admin.find({});
        const adminsFromUserSchema = await User.find({ role: "ADMIN" });

        const adminMap = new Map();
        adminsFromAdminSchema.forEach(a => adminMap.set(a._id.toString(), a));
        adminsFromUserSchema.forEach(a => adminMap.set(a._id.toString(), a));

        const admins = Array.from(adminMap.values());

        const creators = await Promise.all(
            admins.map(async (admin) => {
                const totalMarket = await Market.countDocuments({
                    createdBy: admin._id
                });

                const totalVolumeAgg = await Market.aggregate([
                    { $match: { createdBy: admin._id } },
                    { $group: { _id: null, volume: { $sum: "$totalVolume" } } }
                ]);

                return {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    totalMarket,
                    totalVolume: totalVolumeAgg.length > 0 ? totalVolumeAgg[0].volume : 0
                };
            })
        );

        creators.sort((a, b) => b.totalVolume - a.totalVolume);

        return resp.status(200).json(
            creators.map((creator, index) => ({
                rank: index + 1,
                ...creator
            }))
        );
    } catch (error) {
        console.error(error);
        return resp.status(500).json({ message: "Failed to fetch creators" });
    }
};

module.exports = {
    getLeaderboard,
    getTopCreators
};