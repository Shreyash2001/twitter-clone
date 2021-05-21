import mongoose from "mongoose"

const PostSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String
    },
    image: {
        type: String
    },
    pinned: Boolean,

    likes: [{type: mongoose.Types.ObjectId, ref: "User"}],

    retweetUsers: [{type: mongoose.Types.ObjectId, ref: "User"}],

    retweetData: {type: mongoose.Types.ObjectId, ref: "Post"},

    replyTo: {type: mongoose.Types.ObjectId, ref: "Post"},
}, {
    timestamps: true
})

const Post = mongoose.model("Post", PostSchema)

export default Post