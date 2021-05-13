import express from "express"
import { createMessage, getMessages } from "../controllers/messageController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/:id").get(protect, getMessages)
router.route("/").post(protect, createMessage)

export default router