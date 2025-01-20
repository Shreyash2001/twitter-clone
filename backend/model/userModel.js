const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "image",
    },
    coverPhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/cqn/image/upload/v1619347050/twitter-bird-on-blue-background_i3o3do.png",
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "Post" }],

    retweetedData: [{ type: mongoose.Types.ObjectId, ref: "Post" }],

    following: [{ type: mongoose.Types.ObjectId, ref: "User" }],

    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],

    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
