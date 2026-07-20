const express = require("express");
const router = express.Router();

const { chat } = require("../controllers/aiController");
const authmiddleware = require("../middleware/authMiddleware");

router.post(
    "/chat",
    authmiddleware, 
    chat);

module.exports = router;