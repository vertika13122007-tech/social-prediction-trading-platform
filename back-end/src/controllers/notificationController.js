const Notification = require("../../db/schemas/Notification");

const Market = require("../../db/schemas/Market");

const getNotifications = async (req, res) => {
    try {
        const closedCount = await Market.countDocuments({ status: "CLOSED" });
        const openCount = await Market.countDocuments({ status: "OPEN" });

        if (closedCount > 0) {
            const closedTitle = "Markets Closed Pending Settlement";
            const closedMsg = `${closedCount} market(s) closed and awaiting winner declaration`;
            const existing = await Notification.findOne({ user: req.user.id, title: closedTitle });
            if (!existing) {
                await Notification.create({
                    user: req.user.id,
                    type: "system",
                    title: closedTitle,
                    message: closedMsg,
                    read: false
                });
            } else if (existing.message !== closedMsg) {
                existing.message = closedMsg;
                await existing.save();
            }
        }

        if (openCount > 0) {
            const openTitle = "Active Open Markets";
            const openMsg = `You have ${openCount} active prediction market(s) open`;
            const existing = await Notification.findOne({ user: req.user.id, title: openTitle });
            if (!existing) {
                await Notification.create({
                    user: req.user.id,
                    type: "system",
                    title: openTitle,
                    message: openMsg,
                    read: false
                });
            } else if (existing.message !== openMsg) {
                existing.message = openMsg;
                await existing.save();
            }
        }

        const notifications = await Notification
            .find({ user: req.user.id })
            .sort({ createdAt: -1 });

        return res.json(notifications);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

const markRead = async(req,res)=>{

    await Notification.findOneAndUpdate(
        {
            _id:req.params.id,
            user:req.user.id
        },
        {
            read:true
        }
    );

    res.json({
        message:"Marked as read"
    });

};

const markAllRead = async(req,res)=>{

    await Notification.updateMany(
        {
            user:req.user.id
        },
        {
            read:true
        }
    );

    res.json({
        message:"All notifications marked read"
    });

};

const deleteNotification = async(req,res)=>{

    await Notification.findOneAndDelete({
        _id:req.params.id,
        user:req.user.id
    });

    res.json({
        message:"Deleted"
    });

};

const clearAll = async(req,res)=>{

    await Notification.deleteMany({
        user:req.user.id
    });

    res.json({
        message:"Cleared"
    });

};

const getUnreadCount = async (req, res) => {
    try {

        const count = await Notification.countDocuments({
            user: req.user.id,
            read: false
        });

        return res.json({ count });

    } catch (err) {

        return res.status(500).json({
            message: "Failed"
        });

    }
};

module.exports = {
    getNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    clearAll,
    getUnreadCount
}