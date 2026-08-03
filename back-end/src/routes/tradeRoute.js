const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    buyShares,
    getMyPosition,
    sellShares,
    getTradingHistory
} = require("../controllers/tradeController");

router.post(
    "/buy",
    authMiddleware,
    buyShares
);

router.post(
    "/sell",
    authMiddleware,
    sellShares
);

router.get(
    "/positions",
    authMiddleware,
    getMyPosition
);

router.get(
    "/history",
    authMiddleware,
    getTradingHistory
);

module.exports = router;