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
        },

        settled:{
            type: Boolean,
            default: false
        },

        settledPrice: {
            type: Number,
            default: null
        },

        payout: {
            type: Number,
            default:0
        },

        profitLoss: {
            type: Number,
            default: 0
        },

        result:{
            type: String,
            enum: ["WIN","LOSS"],
        },

        settledAt: {
            type: Date,
            default: null
        },

        createdAt: {
            type: Date,
            default: null
        },

        updatedAt: {
            type: Date,
            default: null
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Position", positionSchema);