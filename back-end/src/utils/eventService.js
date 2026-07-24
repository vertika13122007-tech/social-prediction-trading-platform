const { createNotification } = require("./notificationService");

const publishEvent = async ({
    user,
    type,
    title,
    message,
}) => {

    await createNotification({
        user,
        type,
        title,
        message,
    });

};

module.exports = {
    publishEvent,
};