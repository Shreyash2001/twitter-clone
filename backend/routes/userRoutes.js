import express from "express"
import { registerUser, authUser, likedPosts } from "../controllers/userController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/post/like").put(protect, likedPosts)
router.route("/login").post(authUser)
router.route("/register").post(registerUser)

export default router