const Position = require("../../db/schemas/Position");

const categoryMap = {
    SPORTS: "Sports",
    CREATORS: "Creators",
    MEMES: "Memes",
    PRODUCTS: "Products",
    TRENDS: "Trends"
};

const getTimeLeft = (endsAt) => {
    if (!endsAt) return "Ended";
    const diff = new Date(endsAt) - new Date();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    if (days === 0 && hours === 0) return "Ending soon";
    return `${days}d ${hours}h`;
};

const calculatePortfolio = async (userId) => {
    const positions = await Position.find({
        userId,
        shares: { $gt: 0 }
    }).populate("marketId");

    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalProfitLoss = 0;

    const portfolioPositions = positions
        .filter((position) => position.marketId != null)
        .map((position) => {
            const market = position.marketId;

            const investedAmount = position.investedAmount || (position.shares * position.averageBuyPrice);

            const currentPriceRaw = position.side === "YES" ? market.yesPrice : market.noPrice;

            const currentValue = position.shares * currentPriceRaw;

            const profitLoss = currentValue - investedAmount;

            totalInvested += investedAmount;
            totalCurrentValue += currentValue;
            totalProfitLoss += profitLoss;

            const roiVal = investedAmount > 0 ? ((currentValue - investedAmount) / investedAmount) * 100 : 0;
            const roiStr = `${roiVal >= 0 ? "+" : ""}${roiVal.toFixed(1)}%`;

            const catFormatted = categoryMap[market.category] || market.category || "Trends";

            const winProb = Math.min(100, Math.max(0, Math.round((currentPriceRaw / 10) * 100)));

            return {
                id: position._id,
                marketId: market._id,
                title: market.title,
                category: catFormatted,
                prediction: position.side,
                buyPrice: position.averageBuyPrice ? position.averageBuyPrice / 10 : 0.5,
                currentPrice: currentPriceRaw / 10,
                qty: position.shares,
                totalInvest: Math.round(investedAmount),
                status: market.status === "OPEN" ? "LIVE" : "CLOSED",
                timeLeft: getTimeLeft(market.endsAt),
                endsAt: market.endsAt,
                investors: market.participationCount || 0,
                winProb,
                roi: roiStr,
                pnl: Math.round(profitLoss)
            };
        });

    return {
        totalInvested: Math.round(totalInvested),
        totalCurrentValue: Math.round(totalCurrentValue),
        totalProfitLoss: Math.round(totalProfitLoss),
        positions: portfolioPositions
    };
};

module.exports = {
    calculatePortfolio
};