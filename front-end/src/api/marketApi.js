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