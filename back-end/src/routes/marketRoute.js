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
    getSettledMarkets,
    getTopMarkets,
    getRecentActivity,
    getAdminMyMarkets
} = require("../controllers/marketController");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    saveMarket,
    unsaveMarket
} = require("../controllers/saveController");

router.post(
    "/",
    authMiddleware,
    createMarket
);

router.get(
    "/admin/my-markets",
    authMiddleware,
    getAdminMyMarkets
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
    authMiddleware,
    getOpenMarkets
)

router.get(
    "/settled",
    getSettledMarkets
)

router.get(
    "/top",
    getTopMarkets
)

router.get(
    "/:id",
    authMiddleware,
    getMarketById
);

router.get(
    "/:id/activity",
    authMiddleware,
    getRecentActivity
);

router.patch(
    "/:id/close",
    authMiddleware,
    closeMarket
);

router.post("/:id/save", authMiddleware, saveMarket);

router.delete("/:id/save", authMiddleware, unsaveMarket);

router.patch(
    "/:id/declare-winner",
    authMiddleware,
    declareWinner
);

router.patch(
    "/:id/settleMarket",
    authMiddleware,
    settleMarket
)

module.exports = router;