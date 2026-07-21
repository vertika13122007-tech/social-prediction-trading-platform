import api from "./axios";

export const updateUsername = async (name) => {
    const response = await api.put("/user/username", {
        name,
    });

    return response.data;
};

export const changePassword = async (
    currentPassword,
    newPassword
) => {

    const response = await api.patch(
        "/user/change-password",
        {
            currentPassword,
            newPassword,
        }
    );

    return response.data;
};

export const getNotificationSettings = async () => {

    const res = await api.get(
        "/users/notification-settings"
    );

    return res.data;
};

export const updateNotificationSettings = async (settings) => {

    const res = await api.put(
        "/users/notification-settings",
        settings
    );

    return res.data;
};