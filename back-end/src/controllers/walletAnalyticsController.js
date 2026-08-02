const Transaction = require("../../db/schemas/Transaction");

const getWalletAnalytics = async (req, res) => {

    try {

        const transactions = await Transaction.find({
            userId: req.user.id
        }).sort({ createdAt: 1 });

        let runningBalance = 0;

        const dailyBalances = {};

        transactions.forEach((tx) => {

            if (tx.type === "CREDIT") {
                runningBalance += tx.amount;
            } else {
                runningBalance -= tx.amount;
            }

            const key = tx.createdAt.toISOString().slice(0, 10);

            dailyBalances[key] = runningBalance;

        });

        const chart = [];

        let lastBalance = 0;

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const key = date.toISOString().slice(0, 10);

            if (dailyBalances[key] !== undefined) {
                lastBalance = dailyBalances[key];
            }

            chart.push({
                day: date.toLocaleDateString("en-US", {
                    weekday: "short",
                }),
                balance: lastBalance,
            });

        }

        return res.status(200).json(chart);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Failed to fetch analytics"
        });

    }

};