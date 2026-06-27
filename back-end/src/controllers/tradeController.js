const Market = require("../../db/schemas/Market");
const Position = require("../../db/schemas/Position");

const walletUtils = require("../utils/walletUtils");

const buyShares = async (req , resp ) => {
    try{
        const {
            marketId,
            side,
            shares
        } = req.body ;

        const market = await Market.findById(marketId);

        if (!market){
            return resp.status(404).json({
                message:"Market not found"
            });
        }

        if (market.status !== "OPEN"){
            return resp.status(400).json({
                message: "Market is closed"
            });
        }

        if (side !== "YES" && side !== "NO"){
            return resp.status(400).json({
                message:"Invalid side"
            });
        }

        const sharePrice = 
            side === "YES"
                ? market.yesPrice
                : market.noPrice;

        const totalCost = sharePrice * shares;

        await walletUtils.debitWallet(
            req.user.id,
            totalCost,
            "DEBIT",
            `Bought ${shares} ${side} shares`
        );

        let position = await Position.findOne({
            userId: req.user.id,
            marketId,
            side
        });

        if (!position) {

            position = await Position.create({
                userId: req.user.id,
                marketId,
                side,
                shares,
                averageBuyPrice: sharePrice,
                createdAt: new Date()
            });

        } else {

            const totalOldCost =
                position.shares *
                position.averageBuyPrice;

            const totalNewCost =
                shares *
                sharePrice;

            const totalShares =
                position.shares + shares;

            position.averageBuyPrice =
                (totalOldCost + totalNewCost) /
                totalShares;

            position.shares = totalShares;

            await position.save();
        }

        if (side === "YES") {

            market.totalYesInvestment += totalCost;

        } else {

            market.totalNoInvestment += totalCost;

        }

        market.totalVolume += totalCost;

        await market.save();

        return resp.status(200).json({
            message: "Shares purchased successfully",
            position
        });

    } catch (error) {

        console.error(error);

        return resp.status(500).json({
            message: "Failed to buy shares"
        });
    }
};

const getMyPosition = async ( req, resp ) => {
    try{
        const positions = await Position.find({
            userId: req.user.id
        }).populate(
            "marketId",
            "title status"
        );

        return resp.status(200).json({
            positions
        });
    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to fetch positions"
        });
    }
};


const sellShares = async (req , resp) => {

    try{

        const {
            marketId,
            side,
            shares
        } = req.body ;

        const market = await Market.findById(marketId);

        if (!market){
            return resp.status(404).json({
                message:"Market not found"
            });
        }

        if (market.status !== "OPEN"){
            return resp.status(400).json({
                message: "Market is closed"
            });
        }

        const position = await Position.findOne({
            userId: req.user.id,
            marketId,
            side,
        });

        if (!position){
            return resp.status(404).json({
                message:"No position is present"
        })
        }

        if ( shares <= 0 ){
            return resp.status(400).json({
                message:"Shares must be greater than zero"
            });
        }

        if ( shares > position.shares){
            return resp.status(400).json({
                message:"Not enough shares to sell"
            })
        }

        if( side !== "YES" && side !== "NO" ){
            return resp.status(400).json({
                message:"Invalid side"
            });
        }

        const currentPrice = 
            side === "YES"
                ? market.yesPrice
                : market.noPrice;

        const sellValue = shares * currentPrice;

        await walletUtils.creditWallet(
            req.user.id,
            sellValue,
            "CREDIT",
            `Sold ${shares} ${side} shares`
        );

        position.shares -= shares;

        if( position.shares === 0){
            await Position.deleteOne({
                _id : position._id
            });
        }
        
        else{
            await position.save();
        }

        return resp.status(200).json({
            message: "Shares sold successfully",
            position
        });


    } catch (error) {
        console.error(error);

        return resp.status(500).json({
            message: "Failed to sell shares"
        });
    }
};

module.exports = {
    buyShares,
    getMyPosition,
    sellShares
};
