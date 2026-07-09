const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {getWallet,getTransactions, depositMoney,withdrawMoney} = require('../controllers/walletController');

router.get("/",authMiddleware,getWallet);
router.get("/transactions",authMiddleware,getTransactions);
router.post("/deposit",authMiddleware,depositMoney);
router.post("/withdraw",authMiddleware,withdrawMoney);

module.exports = router;