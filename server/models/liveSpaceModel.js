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

    startDateTime: {
        type: Date,
        required: function() {
            return this.type === 'scheduled';
        },
    },  

    endDateTime: {
        type: Date,
        required: function() {
            return this.type === 'scheduled';
        },
    },   

}, { timestamps: true });



export default mongoose.model('LiveSpace', liveSpaceSchema);
