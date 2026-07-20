import axiosInstance from "./axios";

export const sendMessage = async (message) => {

    const response = await axiosInstance.post(
        "/ai/chat",
        {
            message,
        }
    );

    return response.data.reply;

};