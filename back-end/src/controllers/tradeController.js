const Market = require("../../db/schemas/Market");
const Position = require("../../db/schemas/Position");
const User = require("../../db/schemas/User");

const walletUtils = require("../utils/walletUtils");
const { publishEvent } = require("../utils/eventService");

const { getIO } = require("../socket/socket");

const { emitLiveUpdate } = require("../utils/liveUpdateService");

const buyShares = async (req , resp ) => {
    try{
        const io = getIO();

        const user = await User.findById(req.user.id).select("name");
        
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

        if (
            market.status === "OPEN" &&
            market.endsAt <= new Date()
        ) {
            market.status = "CLOSED";
            await market.save();

            return resp.status(400).json({
                message: "Market has closed."
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
            side,
            settled:false
        });

        let alreadyInvested = await Position.exists({
            userId: req.user.id,
            marketId
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

            const totalNewCost =Number(
                (shares * sharePrice).toFixed(2)
            );

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

        if(!alreadyInvested){
            market.participationCount += 1;

            emitLiveUpdate(io, {
                type: "system",
                title: "New Participant",
                desc: `${user.name} joined "${market.title}"`,
            });
        }

        const totalInvestment = market.totalYesInvestment + market.totalNoInvestment;

        if(totalInvestment > 0 ){
            market.yesPrice = Number(
                ((market.totalYesInvestment/totalInvestment)*10).toFixed(2)
            );

            market.noPrice = Number(
                ((10 - market.yesPrice).toFixed(2))
            );

            emitLiveUpdate(io, {
                type: "market",
                title: "Price Updated",
                desc: `${market.title} • YES ₹${market.yesPrice} • NO ₹${market.noPrice}`,
            });
        }

        await market.save();

        io.emit("marketUpdated", {
            marketId: market._id,
            yesPrice: market.yesPrice,
            noPrice: market.noPrice,
            totalYesInvestment: market.totalYesInvestment,
            totalNoInvestment: market.totalNoInvestment,
            totalVolume: market.totalVolume,
        });

        await publishEvent({
            user: req.user.id,
            type:"tradeUpdates",
            title:"Invested Successful",
            message:`You have invested ₹${totalCost} on "${market.title}". `
        });

        emitLiveUpdate(io, {
            type: "trade",
            title: "New Trade",
            desc: `${user.name} invested ₹${totalCost.toFixed(2)} in ${market.title}`,
        });

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
            userId: req.user.id,
            shares: {$gt: 0},
            settled: false
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
        const user = await User.findById(req.user.id).select("name");

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

        if (
            market.status === "OPEN" &&
            market.endsAt <= new Date()
        ) {
            market.status = "CLOSED";
            await market.save();

            return resp.status(400).json({
                message: "Market has closed."
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

        if (position.shares === 0) {

            await Position.deleteOne({
                _id: position._id
            });

            const remainingPositions = await Position.exists({
                userId: req.user.id,
                marketId
            });

            if (!remainingPositions) {
                market.participantsCount -= 1;
                await market.save();
            }

        } else {

            await position.save();

        }

        emitLiveUpdate(io, {
            type: "trade",
            title: "New Trade",
            desc: `${user.name} sold ₹${shares} from ${market.title}`,
        });

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

const getTradingHistory = async (req,resp) => {

    const history = await Position.find({
        userId: req.user.id
    })
    .populate("marketId","title category")
    .sort({ updatedAt: -1});

    resp.json(history);

};

module.exports = {
    buyShares,
    getMyPosition,
    sellShares
};
