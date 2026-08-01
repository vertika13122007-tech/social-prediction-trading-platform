const LiveUpdate = require("../../db/schemas/LiveUpdate");

const getLiveUpdates = async (req, res) => {

    try {

        const updates = await LiveUpdate
            .find()
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(updates);

    } catch (err) {

        console.error(err);
        res.status(500).json({
            message: "Failed to fetch live updates"
        });

    }

};

module.exports = {
    getLiveUpdates
};