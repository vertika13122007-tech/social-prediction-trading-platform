import api from "./axios";

export const getPortfolio = async () => {
    const response = await api.get("/portfolio");
    return response.data;
};

export const getTradingHistory = async () => {
    const response = await api.get("/trades/history");
    return response.data;
};
