const mongoose = require("mongoose");

const transcationSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    type : {
        type : String,
        enum : [
            "CREDIT",
            "DEBIT",
            "MARKET_BUY",
            "MARKET_SELL",
            "REWARD"
        ],
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    description: {
        type : String,
        required : true
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Transcation",transcationSchema);