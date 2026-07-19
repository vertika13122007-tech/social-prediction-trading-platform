const Market = require("../../db/schemas/Market");
const Position = require("../../db/schemas/Position");
const { getUserRank } = require("../services/leaderboardService");

const getMarketStats = async ( req, resp )=>{
    try{

        const openMarkets = await Market.countDocuments({
            status:"OPEN"
        });

        const pool = await Market.aggregate([
            {
                $match: {
                    status:"OPEN"
                },
            },
            {
                $group: {
                    _id:null,
                    totalPool: {
                        $sum: "$totalVolume"
                    }
                } 
            }
        ]);

        const totalPool = pool[0]?.totalPool || 0 ;

        const traders = await Position.aggregate([
            {
                $group:{
                    _id: "$userId"
                }
            }
        ]);

        const activeTraders = traders.length;

        const rank = await getUserRank(req.user.id);

        return resp.status(200).json({
            activeTrades: openMarkets,
            totalPool,
            activeTraders,
            rank
        });

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to fetch the data"
        });
    }
}

module.exports = {
    getMarketStats
}
