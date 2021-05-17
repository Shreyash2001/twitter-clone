import express from "express"
import { getNotification, updateNotification, updateAllNotification, getUnreadNotification } from "../controllers/notificationController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/unread").get(protect, getUnreadNotification)
router.route("/mark-all-read").get(protect, updateAllNotification)
router.route("/").get(protect, getNotification).put(protect, updateNotification)

export default router