const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createMarket,
    getAllMarkets,
    getMarketById
} = require("../controllers/marketController");


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

module.exports = router;