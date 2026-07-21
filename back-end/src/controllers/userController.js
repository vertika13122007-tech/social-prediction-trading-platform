const User = require("../../db/schemas/User");
const bcrypt = require("bcryptjs");

const updateUsername = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name || name.trim().length < 3) {
            return res.status(400).json({
                message: "Username must be at least 3 characters."
            });
        }

        const existing = await User.findOne({
            name: name.trim(),
            _id: { $ne: req.user.id }
        });

        if (existing) {
            return res.status(400).json({
                message: "Username already taken."
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                name: name.trim()
            },
            { new: true }
        );

        res.json({
            message: "Username updated successfully.",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email
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
                message: "Password must be at least 8 characters."
            });
        }


        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const match = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!match) {
            return res.status(400).json({
                message: "Current password is incorrect."
            });
        }

        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

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

        const user = await User.findById(req.user.id);

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

        const user = await User.findById(req.user.id);

        return res.json(user.notificationSettings);

    } catch (err) {

        return res.status(500).json({
            message: "Server Error",
        });

    }

};

module.exports = {
    updateUsername,
    changePassword,
    getNotificationSettings,
    updateNotificationSettings
};