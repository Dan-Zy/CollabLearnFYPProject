import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    message: {
        type: String,
        required: true
    },

    seen: {
        type: Boolean,
        default: false
    },

    type: {
        type: String,
        enum: ["Requested", "Normal"],
        default: "Normal"
    }

},

{ timestamps: true }

);

const Notification = mongoose.model("Notification", notificationSchema, "notifications");

export default Notification;