const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getUserProfile, getProfileSummary, getRecentTransactions, getAchievements } = require("../controllers/profileController");

router.get(
    "/",
    authMiddleware,
    getUserProfile
);

router.get(
    "/summary",
    authMiddleware,
    getProfileSummary
);

router.get(
    "/activity",
    authMiddleware,
    getRecentTransactions
);

router.get(
    "/achievements",
    authMiddleware,
    getAchievements
);

module.exports = router;