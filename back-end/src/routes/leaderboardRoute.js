const express = require("express");

const router = express.Router();

const authmiddleware = require("../middleware/authMiddleware");

const {getLeaderboard,getTopCreators} = require("../controllers/leaderboardController");

router.get(
    "/",
    authmiddleware,
    getLeaderboard
);

router.get(
    "/creators",
    authmiddleware,
    getTopCreators
)

module.exports = router;