const Market = require("../../db/schemas/Market");

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

module.exports = {
    createMarket,
    getAllMarkets,
    getMarketById
};