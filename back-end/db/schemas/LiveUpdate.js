const mongoose = require("mongoose");

const liveUpdateSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            "trade",
            "market",
            "settlement",
            "system",
            "reminder",
        ],
        required: true,
    },

    title: String,

    desc: String,

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model(
    "LiveUpdate",
    liveUpdateSchema
);