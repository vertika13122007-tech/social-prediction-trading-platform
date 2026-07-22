const Notification = require("../../db/schemas/Notification");

const getNotifications = async(req,res)=>{

    const notifications = await Notification
        .find({user:req.user.id})
        .sort({createdAt:-1});

    res.json(notifications);

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

module.exports = {
    getNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    clearAll
}