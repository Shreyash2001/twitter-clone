import asyncHandler from "express-async-handler"
import User from "../model/userModel.js"
import generateToken from "../utils/generateToken.js"

const authUser = asyncHandler(async(req, res) => {
    const {userName, email, password} = req.body
    const user = await User.findOne({$or:[{email}, {userName}]})
    if(user && (await user.matchPassword(password))) {
        res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            image: user.image,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({message:"Invalid email or password"})
    }
})

const registerUser = asyncHandler(async(req, res) => {
    const {firstName, lastName, userName, email, password} = req.body
    const alreadyUser = await User.findOne({$or:[{email}, {userName}]})
    if(alreadyUser) {
        res.status(400).json({message:"Username or Email already present"})
    } else {
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password,
        })
        if(user) {
            res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            token: generateToken(user._id)
            })
        } else {
            res.status(400).json({message:"Something went wrong!!!"})
        }
    }
    
})

export {registerUser, authUser}