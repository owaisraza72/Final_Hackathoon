const Notification = require("../models/notification.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");

class NotificationService {
  /**
   * Create a new notification
   */
  createNotification = async (data) => {
    return await Notification.create(data);
  };

  /**
   * Get notifications for a specific user
   */
  getNotifications = async (userId) => {
    return await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);
  };

  /**
   * Mark notification as read
   */
  markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Notification not found");
    }

    return notification;
  };

  /**
   * Mark all as read
   */
  markAllRead = async (userId) => {
    return await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );
  };

  /**
   * Delete notification
   */
  deleteNotification = async (notificationId, userId) => {
    const result = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!result) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Notification not found");
    }

    return result;
  };
}

module.exports = new NotificationService();
