import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({

    adminId: {
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
    },

    communityBanner: {
        type: String,
        default: ""
    },

    privacy: {
        type: String,
        enum: ["Public", "Private"],
        default: "Public"
    },

    communityGenre: {
        type: String,
        required: true
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },

    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // }



},

{timestamps: true}

);

const Community = mongoose.model("Community", communitySchema, "communities");

export default Community;