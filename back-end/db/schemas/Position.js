const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        marketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Market",
            required: true
        },

        side: {
            type: String,
            enum: ["YES", "NO"],
            required: true
        },

        shares: {
            type: Number,
            default: 0
        },

        averageBuyPrice: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Position", positionSchema);