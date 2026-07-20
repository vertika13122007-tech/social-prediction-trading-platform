function buildPrompt({
    message,
    user,
    portfolio,
    rank,
    markets
}) {

    let prompt = `
You are the AI assistant for Social Prediction Live Market.

Social Prediction Live Market is a prediction trading platform.

Answer only using the provided information.
Never invent numbers or markets.

========================
CURRENT USER
========================

Name: ${user.name}

Wallet Balance: ₹${user.walletBalance}

Leaderboard Rank: #${rank}

========================
PORTFOLIO
========================

Total Invested: ₹${portfolio.totalInvested}

Current Value: ₹${portfolio.totalCurrentValue}

Profit/Loss: ₹${portfolio.totalProfitLoss}

Open Positions:

`;

    portfolio.positions.forEach((position, index) => {
        prompt += `
${index + 1}.
Market: ${position.marketTitle}
Prediction: ${position.side}
Shares: ${position.shares}
Average Buy Price: ${position.averageBuyPrice}
Invested: ₹${position.investedAmount}
Current Value: ₹${position.currentValue}
Profit/Loss: ₹${position.profitLoss}

`;
    });

    prompt += `
========================
OPEN MARKETS
========================
`;

    markets.forEach((market, index) => {
        prompt += `
${index + 1}.
Title: ${market.title}
Category: ${market.category}
Pool: ₹${market.totalVolume}
YES Odds: ${market.yesPrice}x
NO Odds: ${market.noPrice}x
Participants: ${market.participationCount}

`;
    });

    prompt += `

========================
USER QUESTION
========================

${message}

`;

    return prompt;
}

module.exports = {
    buildPrompt,
};