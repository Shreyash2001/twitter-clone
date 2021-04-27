import express from "express"
import { registerUser, authUser } from "../controllers/userController.js"

const router = express.Router()

router.route("/login").post(authUser)
router.route("/register").post(registerUser)

export default router