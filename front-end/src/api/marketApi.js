import api from "./axios"
import { getTopCreators } from "./creatorApi"

export const getTopMarkets = async () => {
    
    const response = await api.get("/markets/top");

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