const Market = require("../../db/schemas/Market");
const Position = require("../../db/schemas/Position");
const walletUtils = require("../utils/walletUtils");
const User = require("../../db/schemas/User");
const { publishEvent } = require("../utils/eventService");
const { emitLiveUpdate } = require("../utils/liveUpdateService");

const createMarket = async (req, res) => {
    try {
        const io = req.app.get("io");

        const {
            title,
            description,
            category,
            endsAt
        } = req.body;

        if (!title || !description || !category || !endsAt) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const market = await Market.create({
            title,
            description,
            category,
            endsAt,
            createdBy: req.user.id,
            closingReminderSent:false
        });

        const users = await User.find({}, "_id");

        for (const user of users) {

            await publishEvent({
                user: user._id,
                type: "marketing",
                title: "New Prediction Live",
                message: `"${market.title}" is now open for trading!`
            });

        }

        emitLiveUpdate(io, {
            type: "market",
            title: "New Trade",
            desc: `${market.title} has been created!!`,
        });

        return res.status(201).json({
            message: "Market created successfully.",
            market
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to create market."
        });
    }
};


const getAllMarkets = async (req, res) => {
    try {

        const markets = await Market.find({
            status: "OPEN"
        }).sort({ createdAt: -1 });
        const user = await User.findById(req.user.id)
            .select("savedMarkets");
        const savedIds = new Set(
            user.savedMarkets.map(id => id.toString())
        );
        const result = markets.map(market => {
        const obj = market.toObject();
            obj.saved = savedIds.has(market._id.toString());
            return obj;
        });
        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch markets."
        });
    }
};


const getMarketById = async (req, res) => {
    try {

        const market = await Market.findById(req.params.id);

        if (!market) {
            return res.status(404).json({
                message: "Market not found."
            });
        }

        return res.status(200).json(market);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch market."
        });
    }
};

const closeMarket = async ( req, resp ) => {
    try{

        const market = await Market.findById(req.params.id);

        if (!market) {
            return resp.status(404).json({
                message: "Market not found."
            });
        }

        if( market.status !== "OPEN" ){
            return resp.status(400).json({
                message:"Market is already closed or settled."
            })
        }

        market.status = "CLOSED";

        await market.save();

        return resp.status(200).json({
            message:"Market closed successfully",
            market
        });

    }catch (error) {
        console.error(error);

        return resp.status(500).json({
            message: "Failed to close the market."
        });
    }
}

const declareWinner = async ( req, resp ) =>{
    try{

        const market = await Market.findById(req.params.id);

        if (!market) {
            return resp.status(404).json({
                message: "Market not found."
            });
        }

        if( market.status !== "CLOSED" ){
            return resp.status(400).json({
                message:"Market must be closed before declaring a winner."
            })
        }

        const { winningSide } = req.body;

        if ( winningSide !== "YES" && winningSide !== "NO"){
            return resp.status(400).json({
                message:"Invalid winning Side."
            })
        }

        if( market.winningSide !== null ){
            return resp.status(400).json({
                message:"Winner cannot be redeclared."
            })
        }
        
        market.winningSide = winningSide;

        await market.save();

        return resp.status(200).json({
            message:"Winner declared successfully",
            market
        });

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to declare the market"
        })
    }
}

const settleMarket = async (req,resp) =>{
    try{
        const io = req.app.get("io");

        const market = await Market.findById(req.params.id);

        if (!market) {
            return resp.status(404).json({
                message: "Market not found."
            });
        }

        if ( market.status === "SETTLED"){
            return resp.status(400).json({
                message: "Market has already been settled."
            });
        }

        if ( market.winningSide === null ){
            return resp.status(400).json({
                message:"Winner has not be declared yet, so market cannot settle the market."
            })
        }
        
        if( market.status !== "CLOSED" ){
            return resp.status(400).json({
                message:"Market must be closed before settling the market."
            })
        }

        const settlementTime = new Date();

        const positions = await Position.find({
            marketId: market._id,
        })

        for( const position of positions){

            if( position.side === market.winningSide){

                const WINNING_SHARE_VALUE = 10

                const payout = position.shares * WINNING_SHARE_VALUE;

                const investedAmount = position.shares*position.averageBuyPrice;

                const profit = payout - investedAmount

                await walletUtils.creditWallet(
                            position.userId,
                            payout,
                            "CREDIT",
                            `Settlement payout - ${market.title}`
                        );

                await publishEvent({
                    user: position.userId,
                    type: "payouts",
                    title: "Prediction Won 🎉",
                    message: `Congratulations! You won ₹${payout} in "${market.title}".`
                });

                position.settled = true;
                position.result = "WIN";
                position.settledPrice = 10;
                position.payout = payout;
                position.profitLoss = profit;
                position.settledAt = settlementTime;

                await position.save();
            }else{

                position.settled = true;
                position.result = "LOSS";
                position.settledPrice = 0;
                position.payout = 0;
                position.profitLoss = -(position.averageBuyPrice * position.shares);
                position.settledAt = settlementTime;

                await publishEvent({
                    user: position.userId,
                    type: "tradeUpdates",
                    title: "Prediction Lost",
                    message: `Your prediction "${market.title}" did not win. Better luck next time!`
                });

                await position.save();

            }

        }

        market.status = "SETTLED";
        market.settledAt = settlementTime;

        await market.save();

        emitLiveUpdate(io, {
            type: "market",
            title: "Winner declaration",
            desc: `${market.title}'s winners have been rewarded!!`,
        });

        return resp.status(200).json({
            message:"Market settled successfully",
        });

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to settle the market"
        })
    }
}

const getTrendingMarkets = async (req,resp) => {
    try{

        const trending = await Position.aggregate([
            {
                $group: {
                    _id: "$marketId",
                    totalSharesTraded: {
                        $sum:"$shares"
                    }
                }
            },
            {
                $sort: {
                    totalPositions: -1
                }
            },
            {
                $lookup: {
                    from: "markets",
                    localField: "_id",
                    foreignField: "_id",
                    as: "market"
                }
            },
            {
                $unwind:"$market"
            },
            {
                $project: {
                    _id: 0,
                    marketId: "$market._id",
                    title: "$market.title",
                    yesPrice: "$market.yesPrice",
                    noPrice: "$market.noPrice",
                    totalPositions: 1
                }
        }
        ]);

        return resp.status(200).json(trending);


    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to fetch trending markets"
        });
    }
};

const getRecentMarkets = async (req,resp) =>{
    try{

        const recent = await Market
            .find({})
            .sort({
                createdAt:-1
            })
            .limit(10)
            .select(" title descriptioin yesPrice noPrice status createdAt");

        return resp.status(200).json(recent);

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to fetch recent markets"
        });
    }
}

const getOpenMarkets = async (req, res) => {
    try {

        const filter = {
            status: "OPEN"
        };

        if (
            req.query.category &&
            req.query.category !== "Home"
        ) {
            filter.category = req.query.category;
        }

        let sortOption = { createdAt: -1 };

        switch (req.query.sort) {

            case "oldest":
                sortOption = { createdAt: 1 };
                break;

            case "volume":
                sortOption = { totalVolume: -1 };
                break;

            case "investors":
                sortOption = { participantsCount: -1 };
                break;

            case "recent":
                sortOption = { updatedAt: -1 };
                break;

            case "endingSoon":
                sortOption = { endsAt: 1 };
                break;

            case "newest":
            default:
                sortOption = { createdAt: -1 };
        }

        const markets = await Market.find(filter)
            .populate("createdBy", "name")
            .sort(sortOption)
            .limit(12);

        // NEW CODE
        const user = await User.findById(req.user.id)
            .select("savedMarkets");

        const savedIds = new Set(
            user.savedMarkets.map(id => id.toString())
        );

        const result = await Promise.all(
            markets.map(async (market) => {
                const obj = await populateCreatorName(market);
                obj.saved = savedIds.has(market._id.toString());
                return obj;
            })
        );

        return res.status(200).json(result);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch open markets"
        });

    }
};

const getSettledMarkets = async (req,resp) =>{
    try{

        const settled = await Market
            .find({
                status:"SETTLED"
            })
            .sort({
                settledAt:-1
            })
            .limit(10)
            .select("title winningSide settledAt createdAt");

        return resp.status(200).json(settled);

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to fetch settled markets"
        });
    }
}

const populateCreatorName = async (marketDoc) => {
    const market = marketDoc.toObject ? marketDoc.toObject() : { ...marketDoc };
    if (market.createdBy && typeof market.createdBy === "object" && market.createdBy.name) {
        return market;
    }
    const creatorId = typeof market.createdBy === "object" ? market.createdBy?._id : market.createdBy;
    if (creatorId) {
        let userDoc = await User.findById(creatorId).select("name");
        if (!userDoc) {
            userDoc = await Admin.findById(creatorId).select("name");
        }
        market.createdBy = { _id: creatorId, name: userDoc?.name || "Admin" };
    } else {
        market.createdBy = { name: "Admin" };
    }
    return market;
};

const getTopMarkets = async (req, resp) => {
    try {
        const markets = await Market
            .find()
            .populate("createdBy", "name")
            .sort({ totalVolume: -1 })
            .limit(10);

        const formattedMarkets = await Promise.all(
            markets.map(async (market, index) => {
                const withCreator = await populateCreatorName(market);
                return {
                    rank: index + 1,
                    title: withCreator.title,
                    creator: withCreator.createdBy?.name || "Admin",
                    totalVolume: withCreator.totalVolume || 0,
                    yesPrice: withCreator.yesPrice || 5,
                    noPrice: withCreator.noPrice || 5
                };
            })
        );

        return resp.status(200).json(formattedMarkets);

    } catch (error) {
        console.error(error);

        return resp.status(500).json({
            message: "Failed to fetch Top markets"
        });
    }
};

const getRecentActivity = async (req, res) => {
    try {

        const positions = await Position.find({
            marketId: req.params.id
        })
        .populate("userId", "name")
        .sort({ createdAt: -1 })
        .limit(8);

        const activity = positions.map(position => ({
            user: position.userId.name,
            amount: position.investedAmount,
            side: position.side,
            time: position.createdAt
        }));

        return res.json(activity);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Failed to load activity"
        });

    }
};

const getAdminMyMarkets = async (req, res) => {
    try {
        const adminId = req.user.id;

        // Open markets created by logged-in admin
        let openMarkets = await Market.find({
            createdBy: adminId,
            status: "OPEN"
        })
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

        if (openMarkets.length === 0) {
            openMarkets = await Market.find({ status: "OPEN" })
                .populate("createdBy", "name")
                .sort({ createdAt: -1 });
        }

        // Closed markets created by logged-in admin where winner has not been settled
        let closedMarkets = await Market.find({
            createdBy: adminId,
            status: "CLOSED"
        })
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

        if (closedMarkets.length === 0) {
            closedMarkets = await Market.find({ status: "CLOSED" })
                .populate("createdBy", "name")
                .sort({ createdAt: -1 });
        }

        // Settled markets created by logged-in admin (only 10 newest)
        let settledMarkets = await Market.find({
            createdBy: adminId,
            status: "SETTLED"
        })
        .populate("createdBy", "name")
        .sort({ settledAt: -1, createdAt: -1 })
        .limit(10);

        if (settledMarkets.length === 0) {
            settledMarkets = await Market.find({ status: "SETTLED" })
                .populate("createdBy", "name")
                .sort({ settledAt: -1, createdAt: -1 })
                .limit(10);
        }

        return res.status(200).json({
            openMarkets,
            closedMarkets,
            settledMarkets
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch admin markets."
        });
    }
};

module.exports = {
    createMarket,
    getAllMarkets,
    getMarketById,
    closeMarket,
    declareWinner,
    settleMarket,
    getTrendingMarkets,
    getRecentMarkets,
    getOpenMarkets,
    getSettledMarkets,
    getTopMarkets,
    getRecentActivity,
    getAdminMyMarkets
};