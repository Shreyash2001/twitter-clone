import express from "express"
import { createPost, getPosts, createUsersLike, createUsersRetweet, getPostsById, deletePostById, pinPostById, getSearchedPosts } from "../controllers/postController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()


router.route("/search?").get(protect, getSearchedPosts)
router.route("/retweets").post(protect, createUsersRetweet)
router.route("/like").put(protect, createUsersLike)
router.route("/create-post").post(protect, createPost)
router.route("/:id").get(protect, getPostsById).put(protect, pinPostById).delete(protect, deletePostById)
router.route("/").post(getPosts)


export default router