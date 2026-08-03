import api from "./axios";

export const getStats = async () => {
    const response = await api.get("/stats");
    return response.data;
};

export const getAdminAnalytics = async () => {
    const response = await api.get("/stats/admin");
    return response.data;
};

export const getAdminTransactions = async () => {
    const response = await api.get("/stats/admin/transactions");
    return response.data;
};

export const getAdminActivity = async () => {
    const response = await api.get("/stats/admin/activity");
    return response.data;
};