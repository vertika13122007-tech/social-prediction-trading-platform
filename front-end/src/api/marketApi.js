import api from "./axios"
import { getTopCreators } from "./creatorApi"

export const getTopMarkets = async () => {
    const response = await api.get("/markets/top");
    return response.data;
}

export const getTrendingMarkets = async () => {
    const response = await api.get("/markets/trending");
    return response.data;
}

export const getOpenMarkets = async (
    category = "Home",
    sort = "newest"
) => {

    const response = await api.get("/markets/open",{
        params: {
            category,
            sort
        }
    });

    return response.data;
}

export const saveMarket = async (id) => {
    const response = await api.post(`/markets/${id}/save`);
    return response.data;
};

export const unsaveMarket = async (id) => {
    const response = await api.delete(`/markets/${id}/save`);
    return response.data;
};

export const getRecentActivity = async (marketId) => {
    const response = await api.get(`/markets/${marketId}/activity`);
    return response.data;
};

export const createMarket = async (marketData) => {
    const response = await api.post("/markets", marketData);
    return response.data;
};

export const getAdminMyMarkets = async () => {
    const response = await api.get("/markets/admin/my-markets");
    return response.data;
};

export const closeMarket = async (id) => {
    const response = await api.patch(`/markets/${id}/close`);
    return response.data;
};

export const declareWinner = async (id, winningSide) => {
    const response = await api.patch(`/markets/${id}/declare-winner`, { winningSide });
    return response.data;
};

export const settleMarket = async (id) => {
    const response = await api.patch(`/markets/${id}/settleMarket`);
    return response.data;
};