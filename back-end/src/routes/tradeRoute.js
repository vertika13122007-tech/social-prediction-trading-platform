const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    buyShares,
    getMyPosition,
    sellShares
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

module.exports = router;