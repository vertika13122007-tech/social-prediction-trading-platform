import api from "./axios";

export const getTopCreators = async () => {

    const response = await api.get("/leaderboard/creators");

    return response.data;
}