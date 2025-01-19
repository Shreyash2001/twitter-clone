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

    "1. Identify the clothing item in the image (e.g., shirt, pants, jacket, etc.). 2. Describe the primary color of the clothing item in detail. 3. Suggest complementary colors for shirts, pants, or jackets that would pair well with this clothing item. 4. Provide the suggested colors as HEX codes in a single line, formatted as: Hex Codes for (Shirts/Pants/Jackets): #XXXXXX, #XXXXXX, #XXXXXX",
  ]);
  const parsedData = parseClothingDetails(result.response.text());
  console.log(parsedData);
  return res.json(parsedData);
});

function parseClothingDetails(input) {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean); // Clean up extra spaces and empty lines.

  const clothingItem = {
    type: "",
    description: "",
  };

  const primaryColor = {
    description: "",
    hexCodes: [],
  };

  const complementaryColors = {
    shirts: {
      description: "",
      hexCodes: [],
    },
    pants: {
      description: "",
      hexCodes: [],
    },
    jackets: {
      description: "",
      hexCodes: [],
    },
  };

  let currentSection = "";

  lines.forEach((line) => {
    if (line.startsWith("1.")) {
      currentSection = "clothingItem";
      clothingItem.description = line.slice(2).trim();
      clothingItem.type = extractClothingType(line);
    } else if (line.startsWith("2.")) {
      currentSection = "primaryColor";
    } else if (line.startsWith("3.")) {
      currentSection = "complementaryColors";
    } else if (line.startsWith("4.")) {
      currentSection = "hexCodes";
    }

    if (currentSection === "primaryColor" && !line.startsWith("2.")) {
      primaryColor.description += line + " ";
    }

    if (currentSection === "complementaryColors" && line.includes("Shirts")) {
      complementaryColors.shirts.description =
        extractComplementaryColorDescription(line);
    }

    if (currentSection === "complementaryColors" && line.includes("Pants")) {
      complementaryColors.pants.description =
        extractComplementaryColorDescription(line);
    }

    if (currentSection === "complementaryColors" && line.includes("Jackets")) {
      complementaryColors.jackets.description =
        extractComplementaryColorDescription(line);
    }

    if (currentSection === "hexCodes" && line.includes("Shirts")) {
      complementaryColors.shirts.hexCodes = extractHexCodes(line);
    }

    if (currentSection === "hexCodes" && line.includes("Pants")) {
      complementaryColors.pants.hexCodes = extractHexCodes(line);
    }

    if (currentSection === "hexCodes" && line.includes("Jackets")) {
      complementaryColors.jackets.hexCodes = extractHexCodes(line);
    }
  });

  return {
    clothingItem,
    primaryColor,
    complementaryColors,
  };
}

// Helper function to extract clothing type (shirt, pants, etc.)
function extractClothingType(line) {
  const match = line.match(/is a (\w+)/);
  return match ? match[1] : "";
}

// Helper function to extract descriptions of complementary colors (shirts, pants, jackets)
function extractComplementaryColorDescription(line) {
  const match = line.match(/[\*\-]+\s*(.*?)(?=\s*\*\*|$)/);
  return match ? match[1].trim() : "";
}

// Helper function to extract hex codes from a line
function extractHexCodes(line) {
  const hexRegex = /#([0-9A-Fa-f]{6})/g;
  const matches = [];
  let match;
  while ((match = hexRegex.exec(line)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

// // Example input
const input = `
1. The clothing item is a shirt.

2. The primary color is a multi-color plaid pattern. The most prominent colors within the plaid are a medium-dark red, a dark grayish-blue/navy, and an off-white/cream. These colors are interwoven to create the plaid effect.

3. Complementary colors would be:

* **Shirts (if layering under the plaid shirt):** Plain white, light gray, or a solid dark charcoal.
* **Pants:** Dark navy, olive green, dark brown, or beige chinos/khakis.
* **Jackets:** A medium to dark brown leather jacket, a navy blue bomber jacket, or an olive green field jacket.

4. Hex Codes for Shirts: #FFFFFF, #D3D3D3, #36454F; Hex Codes for Pants: #000080, #808000, #A0522D, #F5F5DC; Hex Codes for Jackets: #A0522D, #000080, #556B2F
`;

// Example usage
const result = parseClothingDetails(input);
console.log(JSON.stringify(result, null, 2));

// Helper function to extract hex codes from a line
function extractHexCodes(line) {
  const hexRegex = /#([0-9A-Fa-f]{6})/g;
  const matches = [];
  let match;
  while ((match = hexRegex.exec(line)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

// // Example usage
// const result = parseClothingDetails(input);
// console.log(JSON.stringify(result, null, 2));

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
