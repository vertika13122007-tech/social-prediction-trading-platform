const User = require("../../db/schemas/User");
const Position = require("../../db/schemas/Position");
const WalletTranscation = require("../../db/schemas/Transaction");
const { calculatePortfolio } = require("../services/portfolioService");
const { getUserRank } = require("../services/leaderboardService");

const getUserProfile = async (req, resp) => {
    try {
        const currentUser = await User.findById(req.user.id).select(
            "name email walletBalance role avatar"
        );

        if (!currentUser) {
            return resp.status(404).json({
                message: "User not found"
            });
        }

        // Calculate portfolio for every user
        const users = await User.find({});

        const leaderboard = await Promise.all(
            users.map(async (user) => {
                const portfolio = await calculatePortfolio(user._id);

                return {
                    userId: user._id.toString(),
                    totalProfitLoss: portfolio.totalProfitLoss
                };
            })
        );

        // Sort by profit
        leaderboard.sort(
            (a, b) => b.totalProfitLoss - a.totalProfitLoss
        );

        // Find current user's rank
        const rank =
            leaderboard.findIndex(
                (u) => u.userId === req.user.id
            ) + 1;

        return resp.status(200).json({
            name: currentUser.name,
            email: currentUser.email,
            walletBalance: currentUser.walletBalance,
            role: currentUser.role,
            avatar: currentUser.avatar || null,
            rank: rank || "Unranked"
        });

    } catch (error) {
        console.error(error);

        return resp.status(500).json({
            message: "Failed to fetch profile."
        });
    }
};

const getProfileSummary = async (req, resp) => {
    try {

        const portfolio = await calculatePortfolio(req.user.id);

        const totalTrades = await Position.countDocuments({
            userId: req.user.id
        });

        const winningTrades = await Position.countDocuments({
            userId: req.user.id,
            status: "WON"
        });

        const winRate =
            totalTrades === 0
                ? 0
                : ((winningTrades / totalTrades) * 100).toFixed(1);

        return resp.json({
            totalTrades,
            winRate,
            totalProfit: portfolio.totalProfitLoss
        });

    } catch (err) {

        console.error(err);

        return resp.status(500).json({
            message: "Failed to fetch profile summary"
        });
    }
};

const getRecentTransactions = async (req, resp) => {
    try {

        const transactions = await WalletTranscation.find({
            userId: req.user.id
        })
        .sort({ createdAt: -1 })
        .limit(10);


        const activity = transactions.map((transaction) => {

            let activityType = "trade";

            switch (transaction.type) {
                case "CREDIT":
                    activityType = "credit";
                    break;

                case "REWARD":
                    activityType = "deposit";
                    break;

                case "DEBIT":
                    activityType = "withdrawal";
                    break;

                case "MARKET_BUY":
                    activityType = "market_buy";
                    break;

                case "MARKET_SELL":
                    activityType = "market_sell";
                    break;
            }

            return {
                id: transaction._id,
                title: transaction.description,
                amount: transaction.amount,
                type: activityType,
                date: transaction.createdAt
            };
        });

        return resp.status(200).json(activity);

    } catch (error) {
        console.error(error);

        return resp.status(500).json({
            message: "Failed to fetch recent activity."
        });
    }
};

const getAchievements = async (req, resp) => {
    try {

        const userId = req.user.id;

        const user = await User.findById(userId);

        const positions = await Position.find({
            userId
        });

        const rank = await getUserRank(userId);

        const portfolio = await calculatePortfolio(userId);

        const totalTrades = positions.length;

        const totalProfit = portfolio.totalProfitLoss;

        const wallet = user.walletBalance;

        const achievements = [
            {
                id:1,
                label:"🎯 First Trade",
                unlocked: totalTrades>=1
            },

            {
                id:2,
                label:"📈 5 Trades",
                unlocked: totalTrades>=5
            },

            {
                id:3,
                label:"📊 25 Trades",
                unlocked: totalTrades>=25
            },

            {
                id:4,
                label:"💰 Profit ₹1,000",
                unlocked: totalProfit>=1000
            },

            {
                id:5,
                label:"💎 Profit ₹10,000",
                unlocked: totalProfit>=10000
            },

            {
                id:6,
                label:"🏦 Wallet ₹50,000",
                unlocked: wallet>=50000
            },

            {
                id:7,
                label:"👑 Top 100",
                unlocked: rank<=100
            },

            {
                id:8,
                label:"🏆 Top 10",
                unlocked: rank<=10
            },

            {
                id:9,
                label:"⚡ Market Veteran",
                unlocked: totalTrades>=100
            },

            {
                id:10,
                label:"🚀 Prediction Master",
                unlocked:
                    wallet>=100000 &&
                    totalProfit>=25000
            }

            ];

        return resp.json(achievements);

    } catch (error) {
        console.error(error);

        return resp.status(500).json({
            message: "Failed to fetch achievements."
        });
    }
};

module.exports = {
    getUserProfile,
    getProfileSummary,
    getRecentTransactions,
    getAchievements
};