import express from "express"
import { getUserProfile, getUserProfileByUserName } from "../controllers/profileController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/:username").get(protect, getUserProfileByUserName)
router.route("/").get(protect, getUserProfile)

export default router