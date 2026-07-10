const { calculatePortfolio } = require("../services/portfolioService");

const portfolioSummary = async ( req , resp ) =>{

    try{

        const portfolio = await calculatePortfolio(req.user_id);

        return res.status(200).json(portfolio);

    }catch(error){
        console.error(error);

        return resp.status(500).json({
            message: "Failed to fetch Portfolio"
        });
    }

};

module.exports = {
    portfolioSummary
}