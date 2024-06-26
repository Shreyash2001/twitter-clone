const asyncHandler = require("express-async-handler");
const Notification = require("../model/notificationModel.js");

const getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.find({
    userTo: req.user._id,
    notificationType: { $ne: "newMessage" },
  })
    .populate("userFrom")
    .populate("userTo")
    .sort({ createdAt: -1 });

  if (notification) {
    res.status(200).json(notification);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

const getUnreadNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.find({
    userTo: req.user._id,
    notificationType: { $ne: "newMessage" },
    opened: false,
  })
    .populate("userFrom")
    .populate("userTo")
    .sort({ createdAt: -1 });

  if (notification) {
    res.status(200).json(notification);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

const getLatestUnreadNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.find({
    userTo: req.user._id,
    notificationType: { $ne: "newMessage" },
    opened: false,
  })
    .sort({ createdAt: -1 })
    .populate("userFrom")
    .populate("userTo");

  if (notification) {
    res.status(200).json(notification);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

const updateNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.body.id, {
    opened: true,
  });

  if (notification) {
    res.status(200).json({ message: "updated successfully" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

const updateAllNotification = asyncHandler(async (req, res) => {
  await Notification.updateMany({ opened: true });
  const notification = await Notification.find({
    userTo: req.user._id,
    notificationType: { $ne: "newMessage" },
  })
    .populate("userFrom")
    .populate("userTo")
    .sort({ createdAt: -1 });

  if (notification) {
    res.status(200).json(notification);
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = {
  getNotification,
  updateNotification,
  updateAllNotification,
  getUnreadNotification,
  getLatestUnreadNotification,
};
