import api from "./axios";


export const getWallet = async () => {
    const response = await api.get("/wallet");
    return response.data;
};


export const getTransactions = async () =>{
    const response = await api.get("/wallet/transactions");
    return response.data;
};


export const deposit = (amount) => {
    api.post("/wallet/deposit", {amount});
};


export const withdraw = (amount) => {
    api.post("/wallet/withdraw", {amount});
};