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
    pinned: Boolean,

    likes: [{type: mongoose.Types.ObjectId, ref: "User"}],

    retweetedUsers: [{type: mongoose.Types.ObjectId, ref: "User"}],

    retweetedData: {type: mongoose.Types.ObjectId, ref: "Post"},
}, {
    timestamps: true
})

const Post = mongoose.model("Post", PostSchema)

export default Post