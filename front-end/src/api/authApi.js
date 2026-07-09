import api from "./axios";

export const login = async (formData) =>{
    const response = await api.post(
        "/auth/login",
        formData
    );

    return response.data;

};

export const register = async (formData) => {
    const response = await api.post(
        "/auth/register",
        formData
    );

    return response.data;
    
};

export const verifyOtp = async (data) =>{
    const response = await api.post(
        "/auth/verify-otp",
        data
    );

    return response.data

};