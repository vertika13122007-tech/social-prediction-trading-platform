const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createMarket,
    getAllMarkets,
    getMarketById,
    closeMarket,
    declareWinner,
    settleMarket,
    getTrendingMarkets,
    getRecentMarkets,
    getOpenMarkets,
    getSettledMarkets
} = require("../controllers/marketController");
const adminMiddleware = require("../middleware/adminMiddleware");


router.post(
    "/",
    authMiddleware,
    createMarket
);


router.get(
    "/",
    getAllMarkets
);

router.get(
    "/trending",
    getTrendingMarkets
);

router.get(
    "/recent",
    getRecentMarkets
)

router.get(
    "/open",
    getOpenMarkets
)

router.get(
    "/settled",
    getSettledMarkets
)


router.get(
    "/:id",
    getMarketById
);

router.patch(
    "/:id/close",
    authMiddleware,
    adminMiddleware,
    closeMarket
);

router.patch(
    "/:id/declare-winner",
    authMiddleware,
    adminMiddleware,
    declareWinner
);

router.patch(
    "/:id/settleMarket",
    authMiddleware,
    adminMiddleware,
    settleMarket
)

module.exports = router;