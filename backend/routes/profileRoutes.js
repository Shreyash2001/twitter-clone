import express from "express"
import { getUserProfile, getUserProfileByUserName, usersFollowers } from "../controllers/profileController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/:username/followers").get(protect, usersFollowers)
router.route("/:username").get(getUserProfileByUserName)
router.route("/").get(protect, getUserProfile)

export default router