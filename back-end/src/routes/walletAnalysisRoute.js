const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getWalletAnalytics
} = require("../controllers/walletAnalyticsController");

router.get(
    "/analytics",
    authMiddleware,
    getWalletAnalytics
);

module.exports = router;