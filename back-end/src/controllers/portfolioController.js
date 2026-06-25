const Position = require("../../db/schemas/Position");

const portfolioSummary = async ( req , resp ) =>{

    try{

        const positions = await Position.find({
            userId : req.user.id
        }).populate("marketId");

        let totalInvested = 0;
        let totalCurrentValue = 0;
        let totalProfitLoss = 0;

        if (positions.length === 0) {
            return resp.status(200).json({
                totalInvested: 0,
                totalCurrentValue: 0,
                totalProfitLoss: 0,
                positions: []
            });
        }

        const portfolioPositions = positions.map((position) =>{

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

            return{
                marketTitle:
                    position.marketId.title,
                side : position.side,
                shares : position.shares,
                averageBuyPrice: position.averageBuyPrice,
                investedAmount,
                currentValue,
                profitLoss
            };

        });

        return resp.status(200).json({
            totalInvested,
            totalCurrentValue,
            totalProfitLoss,
            positions: portfolioPositions
        });

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message: "Failed to fetch Portfolio"
        });
    }

};

module.exports = {
    portfolioSummary
}