const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { updateUsername, changePassword, getNotificationSettings, updateNotificationSettings, getAllUsers } = require("../controllers/userController");

router.get(
    "/all",
    authMiddleware,
    getAllUsers
);

router.put(
    "/username", 
    authMiddleware, 
    updateUsername
);

router.patch(
    "/change-password",
    authMiddleware,
    changePassword
);

router.get(
    "/notification-settings",
    authMiddleware,
    getNotificationSettings
);

router.put(
    "/notification-settings",
    authMiddleware,
    updateNotificationSettings
);

module.exports = router;