const Market = require("../../db/schemas/Market");
const Position = require("../../db/schemas/Position");
const User = require("../../db/schemas/User");

const { askAI } = require("../services/ai/aiService");
const { buildPrompt } = require("../services/ai/promptBuilder");
const { getUserRank } = require("../services/leaderboardService");
const { calculatePortfolio } = require("../services/portfolioService");

const chat = async (req, resp) => {
    try{

        const { message } = req.body;

        if (!message) {
            return resp.status(400).json({
                message: "Message is required",
            });
        }

        const userId = req.user.id;
        
        const markets = await Market.find(
            {
                status:"OPEN"
            },
            {
                title: 1,
                category: 1,
                totalVolume: 1,
                yesPrice: 1,
                noPrice: 1,
                participationCount: 1
            }
        ).lean();


        const rank = await getUserRank(userId);

        const user = await User.findById(
            userId,
            {
                name:1,
                walletBalance:1
            }
        ).lean();

        const portfolio = await calculatePortfolio(userId);

        const prompt = buildPrompt({
            message,
            user,
            portfolio,
            rank,
            markets,
        });

        const reply = await askAI(prompt);

        return resp.status(200).json({
            reply
        });

    }catch(error){
        console.error(error);
        return resp.status(500).json({
            message:"Failed to generate AI response"
        });
    }
};

module.exports = {
    chat
};