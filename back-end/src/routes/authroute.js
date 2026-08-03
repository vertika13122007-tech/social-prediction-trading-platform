const express = require("express");
const router = express.Router();

const User = require("../../db/schemas/User");

const { registerUser, verifyOTP, loginUser, forgotPassword, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile",authMiddleware, async (req,resp) => {
    const user = await User.findById(
        req.user.id
    ).select("-password");

    resp.json(user);
});

module.exports = router;