const express = require("express");
const {
  getNotification,
  updateNotification,
  updateAllNotification,
  getUnreadNotification,
  getLatestUnreadNotification,
} = require("../controllers/notificationController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/latest-unread").get(protect, getLatestUnreadNotification);
router.route("/unread").get(protect, getUnreadNotification);
router.route("/mark-all-read").get(protect, updateAllNotification);
router
  .route("/")
  .get(protect, getNotification)
  .put(protect, updateNotification);

module.exports = router;
