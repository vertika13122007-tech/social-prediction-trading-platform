import api from "./axios"

export const getLeaderboard = async () => {
    const response = await api.get("/leaderboard");

    return response.data;
}