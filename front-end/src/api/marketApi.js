import api from "./axios"
import { getTopCreators } from "./creatorApi"

export const getTopMarkets = async () => {
    
    const response = await api.get("/markets/top");

    return response.data;

}