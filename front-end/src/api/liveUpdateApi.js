import api from "./axios";

export const getLiveUpdates = async () => {

    const response = await api.get("/live-updates");
    return response.data;

};