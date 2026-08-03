const User = require("../../db/schemas/User");
const Admin = require("../../db/schemas/Admin");
const bcrypt = require("bcryptjs");

const updateUsername = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length < 3) {
            return res.status(400).json({
                message: "Username must be at least 3 characters."
            });
        }

        const existingUser = await User.findOne({ name: name.trim(), _id: { $ne: req.user.id } });
        const existingAdmin = await Admin.findOne({ name: name.trim(), _id: { $ne: req.user.id } });

        if (existingUser || existingAdmin) {
            return res.status(400).json({
                message: "Username already taken."
            });
        }

        let updatedUser = await User.findByIdAndUpdate(req.user.id, { name: name.trim() }, { new: true });
        if (!updatedUser) {
            updatedUser = await Admin.findByIdAndUpdate(req.user.id, { name: name.trim() }, { new: true });
        }

        res.json({
            message: "Username updated successfully.",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role || "ADMIN"
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        let user = await User.findById(req.user.id);
        let isAdmin = false;
        if (!user) {
            user = await Admin.findById(req.user.id);
            isAdmin = true;
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {
            return res.status(400).json({
                message: "Current password is incorrect."
            });
        }

        const samePassword = await bcrypt.compare(newPassword, user.password);

        if (samePassword) {
            return res.status(400).json({
                message: "New password must be different from the current password.",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.json({
            message: "Password updated successfully."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

const updateNotificationSettings = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            user = await Admin.findById(req.user.id);
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        user.notificationSettings = req.body;
        await user.save();

        return res.json({
            message: "Notification settings updated.",
            notificationSettings: user.notificationSettings,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
        });
    }
};

const getNotificationSettings = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            user = await Admin.findById(req.user.id);
        }

        const defaults = {
            tradeUpdates: true,
            priceAlerts: true,
            payouts: true,
            leaderboard: false,
            marketing: false,
            sound: true,
        };
        return res.json({ ...defaults, ...(user.notificationSettings || {}) });

    } catch (err) {
        return res.status(500).json({
            message: "Server Error",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch users."
        });
    }
};

module.exports = {
    updateUsername,
    changePassword,
    getNotificationSettings,
    updateNotificationSettings,
    getAllUsers
};