import mongoose from "mongoose";

const CommunityliveSpaceSchema = mongoose.Schema({

    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true
    },

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

    type: {
        type: String,
        enum: ['Instant'],
        required: true,
        default: 'Instant'
    },

    imageBanner: {
        type: String,
        default: ""
    },

    numberOfParticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    eventGenre: {
        type: String,
        default: "Not Specified",
    },

    eventStatus: {
        type: String,
        enum: ["Ongoing", "Completed"],
        default: "Ongoing"
    },

    eventLink: {
        type: String,
        required: true,
        default: ""
    }

}, { timestamps: true });

export default mongoose.model('CommunityLiveSpace', CommunityliveSpaceSchema);
