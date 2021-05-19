import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messagesRoutes from "./routes/messageRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import { Server } from "socket.io";
import { createServer } from "http"
import path from "path"

const app = express()
const httpServer = createServer(app)

app.use(express.json())
dotenv.config()
connectDB()

app.use("/notification", notificationRoutes)
app.use("/messages", messagesRoutes)
app.use("/chat", chatRoutes)
app.use("/profile", profileRoutes)
app.use("/posts", postRoutes)
app.use("/users", userRoutes)

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, function() {
    console.log('listening on Port 5000');
 });

const io = new Server(httpServer, {pingTimeout: 60000}, { wsEngine: 'ws' })

const __dirname = path.resolve()

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")))

    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")))
} else {
    app.get("/", (req,res) => {
        res.send("Api is running...")
    })
}

io.on("connection", (socket) => {

    socket.on("setup", (userInfo) => {
        socket.join(userInfo.id)
        
        socket.emit("connected")
    })

    socket.on("join room", room => socket.join(room))
    socket.on("typing", room => socket.in(room).emit("typing"))
    socket.on("stop typing", room => socket.in(room).emit("stop typing"))
    socket.on("new notification", room => socket.in(room).emit("new notification"))
    
    
    socket.on("new Message", (newMessage) => {
        var chat = newMessage.chat

        if(!chat.users) return console.log("Chat.users is not defined")

        chat.users.forEach(user => {
            if(user._id === newMessage.sender._id) return  
                socket.in(user._id).emit("message received", newMessage)
                
        })
    })
    socket.on("notification received", (newMessage) => {
        var chat = newMessage.chat

        if(!chat.users) return console.log("Chat.users is not defined")

        chat.users.forEach(user => {
            if(user._id === newMessage.sender._id) return  
                socket.in(user._id).emit("notification received", newMessage)
                
        })
    })

    console.log("connected to socket io")
})