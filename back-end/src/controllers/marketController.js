const Market = require("../../db/schemas/Market");
const Position = require("../../db/schemas/Position");
const walletUtils = require("../utils/walletUtils");

const createMarket = async (req, res) => {
    try {
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
            createdBy: req.user.id
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

        return res.status(200).json(markets);

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

                await position.save();

            }

        }

        market.status = "SETTLED";
        market.settledAt = settlementTime;

        await market.save();

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

        // Category filter
        if (
            req.query.category &&
            req.query.category !== "Home"
        ) {
            filter.category = req.query.category;
        }

        let sortOption = { createdAt: -1 };

        switch(req.query.sort){

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

        return res.status(200).json(markets);

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

const getTopMarkets = async (req,resp) => {
    try{
        const markets = await Market
        .find()
        .populate("createdBy","name")
        .sort({
            totalVolume:-1
        })
        .limit(10);

        return resp.status(200).json(
            markets.map((market,index) => ({
                rank: index + 1,
                title: market.title,
                creator: market.createdBy.name,
                totalVolume: market.totalVolume,
                yesPrice: market.yesPrice,
                noPrice: market.noPrice
            }))
        );

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message:"Failed to fetch Top markets"
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
    getTopMarkets
};