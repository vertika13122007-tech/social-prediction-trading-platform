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

const User = require("../../db/schemas/User");
const Admin = require("../../db/schemas/Admin");

const getAdminAnalytics = async (req, res) => {
    try {
        // 1. User metrics
        const totalStandardUsers = await User.countDocuments();
        const totalAdmins = await Admin.countDocuments();
        const totalUsers = totalStandardUsers + totalAdmins;

        // User registration growth by month
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 2. Volume & Market Status metrics
        const markets = await Market.find({});
        let totalVolume = 0;
        let openCount = 0;
        let closedCount = 0;
        let settledCount = 0;

        const categoryStatsMap = {};

        markets.forEach(m => {
            const vol = m.totalVolume || 0;
            totalVolume += vol;

            if (m.status === "OPEN") openCount++;
            else if (m.status === "CLOSED") closedCount++;
            else if (m.status === "SETTLED") settledCount++;

            const cat = m.category || "TRENDS";
            if (!categoryStatsMap[cat]) {
                categoryStatsMap[cat] = { category: cat, count: 0, volume: 0 };
            }
            categoryStatsMap[cat].count += 1;
            categoryStatsMap[cat].volume += vol;
        });

        const categoryBreakdown = Object.values(categoryStatsMap);

        // 3. Position & Trading metrics
        const totalTradesCount = await Position.countDocuments();
        const activeTradersAgg = await Position.aggregate([
            { $group: { _id: "$userId" } }
        ]);
        const activeTradersCount = activeTradersAgg.length;

        // 4. Monthly Volume Trend
        const volumeTrend = await Market.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    volume: { $sum: "$totalVolume" },
                    marketsCount: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 5. Top 5 Markets by Volume
        const topMarkets = await Market.find({})
            .sort({ totalVolume: -1 })
            .limit(5)
            .select("title category totalVolume yesPrice noPrice status");

        return res.status(200).json({
            overview: {
                totalVolume,
                totalUsers,
                totalStandardUsers,
                totalAdmins,
                activeTradersCount,
                totalTradesCount,
                openMarketsCount: openCount,
                closedMarketsCount: closedCount,
                settledMarketsCount: settledCount,
                totalMarketsCount: markets.length
            },
            userGrowth,
            categoryBreakdown,
            volumeTrend,
            topMarkets,
            statusBreakdown: [
                { name: "Open Markets", count: openCount, color: "#10B981" },
                { name: "Closed Markets", count: closedCount, color: "#EF4444" },
                { name: "Settled Markets", count: settledCount, color: "#3B82F6" }
            ]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to load analytics data" });
    }
};

const Transaction = require("../../db/schemas/Transaction");

const getRecentTransactionsAdmin = async (req, res) => {
    try {
        const transactions = await Transaction.find({})
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch transactions" });
    }
};

const getAdminActivity = async (req, res) => {
    try {
        const recentPositions = await Position.find({})
            .populate("userId", "name")
            .populate("marketId", "title")
            .sort({ createdAt: -1 })
            .limit(10);

        const activity = recentPositions.map(pos => ({
            id: pos._id,
            user: pos.userId?.name || "Trader",
            title: pos.marketId?.title || "Prediction Market",
            amount: pos.investedAmount || (pos.shares * (pos.averageBuyPrice || 5)),
            side: pos.side,
            date: pos.createdAt
        }));

        return res.status(200).json(activity);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch activity" });
    }
};

module.exports = {
    getMarketStats,
    getAdminAnalytics,
    getRecentTransactionsAdmin,
    getAdminActivity
};
