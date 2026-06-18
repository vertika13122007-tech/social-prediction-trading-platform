const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {getWallet,getTransactions} = require('../controllers/walletController');

router.get("/",authMiddleware,getWallet);
router.get("/transactions",authMiddleware,getTransactions);

module.exports = router;