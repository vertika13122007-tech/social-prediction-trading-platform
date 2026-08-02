const User = require("../../db/schemas/User");
const Transaction = require("../../db/schemas/Transaction");
const Position = require("../../db/schemas/Position");
const mongoose = require("mongoose");

const getWalletStats = async (req, res) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.user.id);

        const user = await User.findById(userId).select("walletBalance");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const invested = await Position.aggregate([
            {
                $match: {
                    userId,
                    settled: false
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$investedAmount"
                    }
                }
            }
        ]);

        const totalInvested = invested[0]?.total || 0;

        const earned = await Position.aggregate([
            {
                $match: {
                    userId,
                    settled: true
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$profitLoss"
                    }
                }
            }
        ]);

        const totalEarned = earned[0]?.total || 0;

        const totalSettled = await Position.countDocuments({
            userId,
            settled: true
        });

        const wins = await Position.countDocuments({
            userId,
            settled: true,
            result: "WIN"
        });

        const winRate =
            totalSettled === 0
                ? 0
                : Math.round((wins / totalSettled) * 100);

        const recentTransactions = await Transaction.find({
            userId
        })
            .sort({ createdAt: -1 })
            .limit(7);

        let runningBalance = user.walletBalance;

        const graph = [];

        for (const tx of recentTransactions.reverse()) {

            graph.push({
                day: new Date(tx.createdAt).toLocaleDateString("en-US", {
                    weekday: "short"
                }),
                balance: runningBalance
            });

            if (tx.type === "CREDIT") {
                runningBalance += tx.amount;
            } else {
                runningBalance -= tx.amount;
            }
        }

        return res.status(200).json({
            walletBalance: user.walletBalance,
            totalInvested,
            totalEarned,
            winRate,
            weeklyBalance: graph
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Failed to fetch wallet stats"
        });

    }
};

module.exports = {
    getWalletStats
};