const Notification = require("../../db/schemas/Notification");

async function createNotification({
    user,
    type,
    title,
    message,
}) {
    return await Notification.create({
        user,
        type,
        title,
        message,
        read: false,
    });
}

module.exports = {
    createNotification,
};