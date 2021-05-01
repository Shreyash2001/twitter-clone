import express from "express"
import { createPost, getPosts, createUsersLike, createUsersRetweet, getPostsById } from "../controllers/postController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/retweets").post(protect, createUsersRetweet)
router.route("/like").put(protect, createUsersLike)
router.route("/create-post").post(protect, createPost)
router.route("/:id").get(protect, getPostsById)
router.route("/").get(getPosts)


export default router