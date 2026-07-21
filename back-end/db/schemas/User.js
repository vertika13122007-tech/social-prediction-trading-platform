const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type : String,
            required : true,
            trim : true
        },
        email: {
            type : String,
            required : true,
            unique: true,
            lowercase : true
        },
        password: {
            type : String,
            required : true
        },
        walletBalance: {
            type : Number,
            default : 0
        },
        role: {
            type: String,
            enum: ["USER","ADMIN"],
            default: "USER"
        },
        notificationSettings: {
            tradeUpdates: {
                type: Boolean,
                default: true,
            },

            priceAlerts: {
                type: Boolean,
                default: true,
            },

            payouts: {
                type: Boolean,
                default: true,
            },

            leaderboard: {
                type: Boolean,
                default: false,
            },

            marketing: {
                type: Boolean,
                default: false,
            },
        }
    },{
        timestamps: true
    }
);

module.exports = mongoose.model("User",userSchema);