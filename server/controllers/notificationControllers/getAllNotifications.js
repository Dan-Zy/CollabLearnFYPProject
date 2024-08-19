import Notification from "../../models/notificationModel.js";

const getAllNotifications = async (req, res) => {

    try {
        const userId = req.userId;

        // Find all notifications where receivers array contains the userId
        const notifications = await Notification.find({ receivers: userId });

        if (!notifications) {
            return res.status(404).json({
                success: false,
                message: "No notifications found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notifications have been fetched successfully",
            length: notifications.length,
            data: notifications
        });

    } catch (error) {
        console.log("Internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching notifications"
        });
    }

};

export default getAllNotifications;