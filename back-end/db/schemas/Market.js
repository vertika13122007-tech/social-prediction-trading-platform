const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "SPORTS",
                "CRYPTO",
                "ENTERTAINMENT",
                "POLITICS",
                "TECH",
                "MEMES",
                "OTHER"
            ]
        },

        yesPrice: {
            type: Number,
            default: 5,
            min: 0
        },

        noPrice: {
            type: Number,
            default: 5,
            min: 0
        },

        totalYesInvestment: {
            type: Number,
            default: 0
        },

        totalNoInvestment: {
            type: Number,
            default: 0
        },

        totalVolume: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["OPEN", "CLOSED", "RESOLVED"],
            default: "OPEN"
        },

        result: {
            type: String,
            enum: ["YES", "NO", "PENDING"],
            default: "PENDING"
        },

        endsAt: {
            type: Date,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Market", marketSchema);