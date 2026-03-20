const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const notificationService = require("../services/notification.service");
const { HTTP_STATUS } = require("../constants");

class NotificationController {
  // GET /api/v1/notifications
  getList = asyncHandler(async (req, res) => {
    const notifications = await notificationService.getNotifications(req.user._id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, { notifications }, "Notifications fetched")
    );
  });

  // PATCH /api/v1/notifications/:id/read
  markRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user._id
    );

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, { notification }, "Notification marked as read")
    );
  });

  // PATCH /api/v1/notifications/read-all
  markAllRead = asyncHandler(async (req, res) => {
    await notificationService.markAllRead(req.user._id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, null, "All notifications marked as read")
    );
  });

  // DELETE /api/v1/notifications/:id
  deleteNotification = asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.params.id, req.user._id);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, null, "Notification deleted")
    );
  });
}

module.exports = new NotificationController();
