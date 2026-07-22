import api from "./axios";

export const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

export const markRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

export const markAllRead = async () => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};

export const clearNotifications = async () => {
    const response = await api.delete("/notifications");
    return response.data;
};