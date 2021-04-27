import express from "express"
import { createPost, getPosts } from "../controllers/postController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/create-post").post(protect, createPost)
router.route("/").get(getPosts)

export default router