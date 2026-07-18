import api from "./axios";

export const buyShares = async (marketId,side,shares) => {
    const response = await api.post("/trades/buy",{
        marketId,
        side,
        shares
    });
    return response.data;
};