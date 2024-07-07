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

    type: {
        type: String,
        enum: ['Instant', 'Scheduled'],
        required: true
    },

    imageBanner: {
        type: String,
        required: function() {
            return this.type === 'Scheduled';
        },
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
        enum: ["Upcoming", "Ongoing", "Completed"],
        default: function() {
            if(this.type === 'Instant'){
                return "Ongoing";
            }

            return "Upcoming";
        }
    },

    eventLink: {
        type: String,
        default: ""
    },

    startDateTime: {
        type: Date,
        required: function() {
            return this.type === 'Scheduled';
        },
    },  

    endDateTime: {
        type: Date,
        required: function() {
            return this.type === 'Scheduled';
        },
    },   

}, { timestamps: true });



export default mongoose.model('LiveSpace', liveSpaceSchema);
