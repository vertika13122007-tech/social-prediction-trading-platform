const User = require("../../db/schemas/User");

const saveMarket = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        const marketId = req.params.id;

        if (!user.savedMarkets.includes(marketId)) {
            user.savedMarkets.push(marketId);
            await user.save();
        }

        return res.json({
            message: "Market saved"
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Failed to save market"
        });

    }
};

const unsaveMarket = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        const marketId = req.params.id;

        user.savedMarkets = user.savedMarkets.filter(
            id => id.toString() !== marketId
        );

        await user.save();

        return res.json({
            message: "Market unsaved"
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Failed to unsave market"
        });

    }
};

module.exports = {
    saveMarket,
    unsaveMarket
};