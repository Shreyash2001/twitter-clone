import express from "express"
import { createPost, getPosts, createUsersLike } from "../controllers/postController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/like").put(protect, createUsersLike)
router.route("/create-post").post(protect, createPost)
router.route("/").get(getPosts)


export default router