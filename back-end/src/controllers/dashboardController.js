const Market = require("../../db/schemas/Market");
const User= require("../../db/schemas/User");
const Transaction = require("../../db/schemas/Transaction");

const getDashboardStats = async ( req, resp ) =>{
    try{

        const totalMarkets = await Market.countDocuments();

        const openMarkets = await Market.countDocuments({
            status:"OPEN"
        });
        
        const closedMarkets = await Market.countDocuments({
            status:"CLOSED"
        });
        
        const settledMarkets = await Market.countDocuments({
            status:"SETTLED"
        });

        const totalUsers = await User.countDocuments();

        const totalTrades = await Transaction.countDocuments({
            type: { $in: ["MARKET_BUY","MARKET_SELL"]}
        });        

        const volumeResult = await Transaction.aggregate([
            {
                $match: {
                    type:"MARKET_BUY"
                }
            },
            {
                $group: {
                    _id: null,
                    totalVolume: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const totalVolume =
            volumeResult.length > 0
                ? volumeResult[0].totalVolume
                : 0;

        return resp.status(200).json({
            totalMarkets,
            openMarkets,
            closedMarkets,
            settledMarkets,
            totalUsers,
            totalTrades,
            totalVolume
        });

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message: "Failed to fetch dashboard statistics"
        });
    }
}

module.exports = { getDashboardStats };


