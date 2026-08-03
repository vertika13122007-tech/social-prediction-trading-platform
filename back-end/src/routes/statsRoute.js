const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getMarketStats, getAdminAnalytics, getRecentTransactionsAdmin, getAdminActivity } = require("../controllers/statsContorller");

router.get(
    "/",
    authMiddleware,
    getMarketStats
);

router.get(
    "/admin",
    authMiddleware,
    getAdminAnalytics
);

router.get(
    "/admin/transactions",
    authMiddleware,
    getRecentTransactionsAdmin
);

router.get(
    "/admin/activity",
    authMiddleware,
    getAdminActivity
);

module.exports = router;