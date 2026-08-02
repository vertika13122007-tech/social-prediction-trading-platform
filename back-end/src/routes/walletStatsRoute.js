const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getWalletStats
} = require("../controllers/walletStatsController");

router.get("/", authMiddleware, getWalletStats);

module.exports = router;