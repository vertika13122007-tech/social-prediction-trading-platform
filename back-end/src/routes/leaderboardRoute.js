const express = require("express");

const router = express.Router();

const authmiddleware = require("../middleware/authMiddleware");

const {getLeaderboard} = require("../controllers/leaderboardController");

router.get(
    "/",
    authmiddleware,
    getLeaderboard
);

module.exports = router;