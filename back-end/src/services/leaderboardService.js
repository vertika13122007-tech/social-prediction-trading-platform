const User = require("../../db/schemas/User");
const { calculatePortfolio } = require("./portfolioService");

async function getUserRank(userId){

    const users = await User.find({});

    const leaderboard = await Promise.all(
        users.map(async(user)=>{

            const portfolio = await calculatePortfolio(user._id);

            return{
                id:user._id.toString(),
                profit:portfolio.totalProfitLoss
            };

        })
    );

    leaderboard.sort((a,b)=>b.profit-a.profit);

    return (
        leaderboard.findIndex(
            u=>u.id===userId.toString()
        ) + 1
    );

}

module.exports={
    getUserRank
}