const User = require("../../db/schemas/User");
const Transactions = require("../../db/schemas/Transaction");

const getWallet = async (req,resp) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        return resp.status(200).json({
            walletBalance:user.walletBalance
        });
    }catch(error){
        console.error(error);
        resp.status(500).json({
            message:"Failed to fetch wallet"
        });
    }
};

const getTransactions = async (req,resp) => {
    try{
        const transactions = await Transactions.find({
                userId: req.user.id
            }).sort({
                createdAt: -1
            });

        return resp.status(200).json(
            transactions
        );
    }catch(error){
        console.error(error);
        return resp.status(500).json({
            message:"Failed to show transcations"
        });
    }
}

const depositMoney = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Invalid amount"
            });
        }

        const user = await User.findById(req.user.id);

        user.walletBalance += Number(amount);
        await user.save();

        await Transactions.create({
            userId: user._id,
            type: "CREDIT",
            amount,
            description: "Wallet Deposit"
        });

        res.status(200).json({
            message: "Deposit successful",
            walletBalance: user.walletBalance
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Deposit failed"
        });
    }
};


const withdrawMoney = async (req, res) => {
    try {
        const { amount } = req.body;

        const user = await User.findById(req.user.id);

        if (amount > user.walletBalance) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        user.walletBalance -= Number(amount);
        await user.save();

        await Transactions.create({
            userId: user._id,
            type: "DEBIT",
            amount,
            description: "Wallet Withdrawal"
        });

        res.status(200).json({
            message: "Withdrawal successful",
            walletBalance: user.walletBalance
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Withdrawal failed"
        });
    }
};

module.exports = {getWallet,getTransactions,depositMoney,withdrawMoney};