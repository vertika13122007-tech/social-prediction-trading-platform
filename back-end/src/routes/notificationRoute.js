const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getNotifications,markAllRead,markRead,deleteNotification,clearAll} = require("../controllers/notificationController");

router.get("/", authMiddleware, getNotifications);

router.patch("/:id/read", authMiddleware, markRead);

router.patch("/read-all", authMiddleware, markAllRead);

router.delete("/:id", authMiddleware, deleteNotification);

router.delete("/", authMiddleware, clearAll);

module.exports = router;