import express from "express"
import { createChat, getChats, getChatsById, updateChatName } from "../controllers/chatController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/:id").get(protect, getChatsById).put(protect, updateChatName)
router.route("/").post(protect, createChat).get(protect, getChats)

export default router