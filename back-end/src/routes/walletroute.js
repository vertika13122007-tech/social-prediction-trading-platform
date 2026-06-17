const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {getWallet, getTranscations} = require('../controllers/walletController');

router.get("/",authMiddleware,getWallet);
router.get("/transactions",authMiddleware,getTranscations);

module.exports = router;