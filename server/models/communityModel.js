import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    communityName: {
        type: String,
        required: true,
        unique: true
    },

    communityDescription: {
        type: String,
        required: true
    },

    communityTopic: {
        type: String,
        required: true
    },

    privacy: {
        type: String,
        enum: ["Public", "Private"],
        default: "Public"
    },

    totalMembers: {
        type: Number,
    },



});

const Community = mongoose.Model(communitySchema);

export default Community;