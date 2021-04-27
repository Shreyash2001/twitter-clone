import mongoose from "mongoose"

const PostSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    pinned: Boolean
}, {
    timestamps: true
})

const Post = mongoose.model("Post", PostSchema)

export default Post