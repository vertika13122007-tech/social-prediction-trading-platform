const User = require("../../db/schemas/User");
const Transaction = require("../../db/schemas/Transaction");

const creditWallet = async(
    userId,
    amount,
    type,
    description
) => {
    const user = await User.findById(userId);

    if(!user){
        throw new Error("User not found");
    }

    if(amount <= 0 ){
        throw new Error("Amount must be greater than zero");
    }

    user.walletBalance += amount;
    await user.save();

    await Transaction.create({
        userId: user._id,
        type,
        amount,
        description
    });
    return user;
}

const debitWallet = async(
    userId,
    amount,
    type,
    description
) => {
    const user = await User.findById(userId);

    if(!user){
        throw new Error("User not found");
    }

    if(amount <= 0 ){
        throw new Error("Amount must be greater than zero");
    }

    if(user.walletBalance < amount ){
        throw new Error("Insufficient wallet balance");
    }
    
    user.walletBalance -= amount;
    await user.save();

    await Transaction.create({
        userId: user._id,
        type,
        amount,
        description
    });

    return user;
}

module.exports = {
    creditWallet,
    debitWallet
};