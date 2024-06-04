import mongoose from "mongoose";

const liveSpaceSchema = mongoose.Schema({

    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    eventName: {
        type: String,
        required: true
    },

    eventDescription: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },  

    endDate: {
        type: Date,
        required: true,
        default: Date.now
    },   

},

{ timestamps: true }

);