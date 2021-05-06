import express from "express"
import { createPost, getPosts, createUsersLike, createUsersRetweet, getPostsById, deletePostById } from "../controllers/postController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/retweets").post(protect, createUsersRetweet)
router.route("/like").put(protect, createUsersLike)
router.route("/create-post").post(protect, createPost)
router.route("/:id").get(protect, getPostsById).delete(protect, deletePostById)
router.route("/").post(getPosts)


export default router