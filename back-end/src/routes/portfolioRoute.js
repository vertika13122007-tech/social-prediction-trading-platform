const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    portfolioSummary
} = require("../controllers/portfolioController");

router.get(
    "/",
    authMiddleware,
    portfolioSummary
);

module.exports = router;