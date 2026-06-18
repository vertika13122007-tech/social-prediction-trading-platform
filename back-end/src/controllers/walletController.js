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

module.exports = {getWallet,getTransactions};