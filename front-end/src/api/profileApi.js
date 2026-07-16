import api from "./axios";

export const getProfile = async () => {
    const response = await api.get("/profile");
    return response.data;
};

export const getProfileSummary = async () => {
    const response = await api.get("/profile/summary");
    return response.data;
};

export const getRecentTransactions = async () => {
    const response = await api.get("/profile/activity");
    return response.data;
};

export const getAchievements = async () => {
    const response = await api.get("/profile/achievements");
    return response.data;
};

export const getPortfolioSummary = async () => {
    const response = await api.get("/portfolio");
    return response.data;
}