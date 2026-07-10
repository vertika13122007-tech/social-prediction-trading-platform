const Position = require("../../db/schemas/Position");

const calculatePortfolio = async (userId) => {

    const positions = await Position.find({
        userId
    }).populate("marketId");

    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalProfitLoss = 0;

    const portfolioPositions = positions.map((position) => {

        const investedAmount =
            position.shares *
            position.averageBuyPrice;

        const currentPrice =
            position.side === "YES"
                ? position.marketId.yesPrice
                : position.marketId.noPrice;

        const currentValue =
            position.shares *
            currentPrice;

        const profitLoss =
            currentValue -
            investedAmount;

        totalInvested += investedAmount;
        totalCurrentValue += currentValue;
        totalProfitLoss += profitLoss;

        return {
            marketTitle: position.marketId.title,
            side: position.side,
            shares: position.shares,
            averageBuyPrice: position.averageBuyPrice,
            investedAmount,
            currentValue,
            profitLoss
        };
    });

    return {
        totalInvested,
        totalCurrentValue,
        totalProfitLoss,
        positions: portfolioPositions
    };
};

module.exports = {
    calculatePortfolio
};