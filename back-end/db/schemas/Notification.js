const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    type:{
        type:String,
        enum:[
            "tradeUpdates",
            "priceAlerts",
            "payouts",
            "leaderboard",
            "marketing",
            "system"
        ],
        required:true
    },

    title:{
        type:String,
        required:true
    },

    desc:{
        type:String,
        required:true
    },

    read:{
        type:Boolean,
        default:false
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Notification",notificationSchema);