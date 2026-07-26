const { getIO } = require( "../socket/socket");
const { createNotification } = require("./notificationService");

const publishEvent = async ({
    user,
    type,
    title,
    message,
}) => {

    notifications = await createNotification({
        user,
        type,
        title,
        message,
    });

    const io = getIO();

    io.to(user.toString()).emit("newNotification",notifications);

};

module.exports = {
    publishEvent,
};