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
        enum: ['instant', 'scheduled'],
        required: true
    },

    startDate: {
        type: String, // Format: YYYY-MM-DD
        required: function() {
            return this.type === 'scheduled';
        },
    },  

    endDate: {
        type: String, // Format: YYYY-MM-DD
        required: function() {
            return this.type === 'scheduled';
        },
    },   

    startTime: {
        type: String, // Format: HH:MM
        required: function() {
            return this.type === 'scheduled';
        }
    },

    endTime: {
        type: String, // Format: HH:MM
        required: function() {
            return this.type === 'scheduled';
        }
    },

}, { timestamps: true });



export default mongoose.model('LiveSpace', liveSpaceSchema);
