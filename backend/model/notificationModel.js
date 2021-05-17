import mongoose from "mongoose"

const notificationSchema = mongoose.Schema({
    userTo: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    userFrom: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    notificationType: {
        type: String,
    },
    opened: {
        type: Boolean,
        default: false
    },
    entityId: {
        type: mongoose.Types.ObjectId,
    }
})

notificationSchema.statics.insertNotification = async(userTo, userFrom, notificationType, entityId) => {
    const data = {
        userTo: userTo,
        userFrom: userFrom,
        notificationType: notificationType,
        entityId: entityId,
    }

    await Notification.deleteOne(data)

    return await Notification.create(data)
}

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification