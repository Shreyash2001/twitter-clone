const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messagesRoutes = require("./routes/messageRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "https://twitter-clone-api-five.vercel.app/",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);
const httpServer = createServer(app);

app.use(express.json());
dotenv.config();
connectDB();

app.use("/api/notification", notificationRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, function () {
  console.log("listening on Port 5000");
});

const io = new Server(httpServer, { pingTimeout: 60000 });

app.get("/", (req, res) => {
  res.send("Api is running...");
});

io.on("connection", (socket) => {
  socket.on("setup", (userInfo) => {
    socket.join(userInfo.id);

    socket.emit("connected");
  });

  socket.on("join room", (room) => socket.join(room));
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new notification", (room) =>
    socket.in(room).emit("new notification")
  );

  socket.on("new Message", (newMessage) => {
    var chat = newMessage.chat;

    if (!chat.users) return console.log("Chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
  socket.on("notification received", (newMessage) => {
    var chat = newMessage.chat;

    if (!chat.users) return console.log("Chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("notification received", newMessage);
    });
  });

  console.log("connected to socket io");
});
