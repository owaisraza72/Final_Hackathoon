const { Router } = require("express");
const notificationController = require("../controllers/notification.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = Router();

router.use(authenticate);

// List notifications
router.get("/", notificationController.getList);

// Mark all as read
router.patch("/read-all", notificationController.markAllRead);

// Mark specific as read
router.patch("/:id/read", notificationController.markRead);

// Delete notification
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
