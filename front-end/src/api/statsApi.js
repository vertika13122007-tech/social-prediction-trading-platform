import api from "./axios";

export const getStats = async () => {
    const response = await api.get("/stats");
    return response.data;
};