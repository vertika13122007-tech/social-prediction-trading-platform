const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getMarketStats } = require("../controllers/statsContorller");

router.get(
    "/",
    authMiddleware,
    getMarketStats
);

module.exports = router;