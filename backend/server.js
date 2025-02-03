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
const { GoogleGenerativeAI } = require("@google/generative-ai");
const creatomate = require("creatomate");

const client = new creatomate.Client(process.env.CREATOMATE_API_KEY);

const app = express();
app.use(
  cors({
    origin: [
      "https://twitter-clone-teal-seven.vercel.app",
      "http://localhost:3000",
    ],
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

app.post("/api/generate-post", async (req, res) => {
  try {
    const { category, text } = req.body;

    // Step 1: Fetch Image from Pexels
    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${category}&per_page=1`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    const pexelsData = await pexelsResponse.json();

    if (!pexelsData.photos.length) {
      return res
        .status(404)
        .json({ error: "No images found for this category" });
    }

    const imageUrl = pexelsData.photos[0].src.large;

    // Step 2: Generate Post using Creatomate
    const creatomateResponse = await fetch(
      "https://api.creatomate.com/v1/render",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CREATOMATE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: "YOUR_TEMPLATE_ID",
          modifications: [
            { name: "image", value: imageUrl },
            { name: "text", value: text },
          ],
        }),
      }
    );

    const creatomateData = await creatomateResponse.json();

    // Return final generated post URL
    res.json({
      image_url: imageUrl,
      generated_post_url: creatomateData.url,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/get-image-details", async (req, res) => {
  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
  const { url } = req.body;
  const imageResp = await fetch(url).then((response) => response.arrayBuffer());

  const result = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(imageResp).toString("base64"),
        mimeType: "image/jpeg",
      },
    },

    "1. Identify the clothing item in the image (e.g., shirt, pants, jacket, etc.). 2. Describe the primary color of the clothing item in detail. 3. Suggest complementary colors for shirts, pants, or jackets that would pair well with this clothing item. 4. Provide the suggested colors as HEX codes in a single line, formatted as: Hex Codes for (Shirts/Pants/Jackets): #XXXXXX, #XXXXXX, #XXXXXX. Give all this details in json format",
  ]);
  const parsedData = parseToJson(result.response.text());
  console.log(parsedData);
  return res.json(parsedData);
});

const parseToJson = (inputString) => {
  try {
    // Remove Markdown formatting markers (` ```json` and ` ``` `)
    const cleanedString = inputString.replace(/```json|```/g, "").trim();
    // Parse the cleaned string as JSON
    const parsedJson = JSON.parse(cleanedString);
    return parsedJson;
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    return null;
  }
};

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
