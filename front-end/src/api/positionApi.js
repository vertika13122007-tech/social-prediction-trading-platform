import api from "./axios";

export const buyShares = async (marketId,side,shares) => {
    const response = await api.post("/trades/buy",{
        marketId,
        side,
        shares
    });
    return response.data;
};

export const sellShares = async (marketId, side, shares) => {
    const response = await api.post("/trades/sell", {
        marketId,
        side,
        shares
    });
    return response.data;
};