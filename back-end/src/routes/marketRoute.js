const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createMarket,
    getAllMarkets,
    getMarketById,
    closeMarket,
    declareWinner,
    settleMarket
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