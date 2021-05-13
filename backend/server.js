import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messagesRoutes from "./routes/messageRoutes.js"

const app = express()

app.use(express.json())
dotenv.config()
connectDB()

app.use("/messages", messagesRoutes)
app.use("/chat", chatRoutes)
app.use("/profile", profileRoutes)
app.use("/posts", postRoutes)
app.use("/users", userRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server Started Successfully on port ${PORT}`)
})