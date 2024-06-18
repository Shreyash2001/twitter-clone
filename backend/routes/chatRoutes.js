const express = require("express");
const {
  createChat,
  getChats,
  getChatsById,
  getUnreadChats,
  updateChatName,
} = require("../controllers/chatController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/unread").get(protect, getUnreadChats);
router.route("/:id").get(protect, getChatsById).put(protect, updateChatName);
router.route("/").post(protect, createChat).get(protect, getChats);

module.exports = router;
