import express from "express"
import { registerUser, authUser, likedPosts, followUnfollowUsers, followersfollowingInfo, updateUserImage } from "../controllers/userController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/update-image").put(protect, updateUserImage)
router.route("/post/like").put(protect, likedPosts)
router.route("/follow").put(protect, followUnfollowUsers).get(protect, followersfollowingInfo)
router.route("/login").post(authUser)
router.route("/register").post(registerUser)

export default router