const User = require("../../db/schemas/User");

const getLeaderboard = async ( req,resp ) => {
    try{

        const users = await User
            .find({})
            .sort({ 
                walletBalance: -1
            })
            .limit(10)
            .select("name walletBalance");

        const leaderboard = users.map((user,index) => {
            return {
                rank: index + 1,
                ...user.toObject()
            }
        });

        return resp.status(200).json({
            leaderboard
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