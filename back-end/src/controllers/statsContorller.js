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
        let openMarketVolume = 0;
        let openCount = 0;
        let closedCount = 0;
        let settledCount = 0;

        const categoryStatsMap = {};

        markets.forEach(m => {
            const vol = m.totalVolume || 0;
            totalVolume += vol;

            if (m.status === "OPEN") {
                openCount++;
                openMarketVolume += vol;
            } else if (m.status === "CLOSED") {
                closedCount++;
            } else if (m.status === "SETTLED") {
                settledCount++;
            }

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

        // 4. Open Markets Volume Data (Total amount present in each OPEN market, irrespective of creation month)
        const openMarketsList = await Market.find({ status: "OPEN" })
            .sort({ totalVolume: -1 })
            .select("title totalVolume category createdAt status");

        let cumulativeOpenVolume = 0;
        const openMarketsVolumeData = openMarketsList.map((m) => {
            const vol = m.totalVolume || 0;
            cumulativeOpenVolume += vol;
            return {
                name: m.title.length > 20 ? m.title.substring(0, 18) + "..." : m.title,
                fullTitle: m.title,
                openVolume: vol,
                cumulativeVolume: cumulativeOpenVolume,
                category: m.category || "TRENDS",
                date: new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            };
        });

        // 5. Monthly Active Open Market Volume Trajectory
        // Carries over previous open markets that have not been closed by month M
        const now = new Date();
        const volumeTrend = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

            const activeOpenMarkets = markets.filter(m => {
                const created = new Date(m.createdAt);
                if (created > monthEnd) return false;

                if (m.status === "OPEN") return true;

                const updated = new Date(m.updatedAt || m.createdAt);
                return updated > monthEnd;
            });

            const monthOpenVolume = activeOpenMarkets.reduce((acc, m) => acc + (m.totalVolume || 0), 0);
            const monthTotalVolume = markets
                .filter(m => new Date(m.createdAt) <= monthEnd)
                .reduce((acc, m) => acc + (m.totalVolume || 0), 0);

            volumeTrend.push({
                _id: {
                    month: d.getMonth() + 1,
                    year: d.getFullYear()
                },
                openVolume: monthOpenVolume,
                totalVolume: monthTotalVolume,
                openMarketsCount: activeOpenMarkets.length,
                marketsCount: markets.filter(m => new Date(m.createdAt) <= monthEnd).length
            });
        }

        // 6. Top 5 Markets by Volume
        const topMarkets = await Market.find({})
            .sort({ totalVolume: -1 })
            .limit(5)
            .select("title category totalVolume yesPrice noPrice status");

        return res.status(200).json({
            overview: {
                totalVolume,
                openMarketVolume,
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
            openMarketsVolumeData,
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
