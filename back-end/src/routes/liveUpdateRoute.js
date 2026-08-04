const express = require("express");

const router = express.Router();

const {
    getLiveUpdates
} = require("../controllers/LiveUpdateController");

router.get("/", getLiveUpdates);

module.exports = router;