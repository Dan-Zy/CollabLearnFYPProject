import mongoose from 'mongoose';
import cron from 'node-cron';
import LiveSpace from '../models/liveSpaceModel.js'; // Adjust the path accordingly
import communityLiveSpaceModel from '../models/communityLiveSpaceModel.js';

// Connect to your MongoDB database
// mongoose.connect(process.env.MONGO_URL)
//     .then(() => {
//         console.log("Connected to MongoDB");
//     })
//     .catch(err => {
//         console.error("Could not connect to MongoDB", err);
//     });

// Function to update event statuses
const updateEventStatuses = async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Update events to "Ongoing" if the start time has passed but the end time has not
    await LiveSpace.updateMany(
        { type: 'Scheduled', startDateTime: { $lte: now }, endDateTime: { $gt: now } },
        { eventStatus: 'Ongoing' }
    );

    // Update events to "Completed" if the end time has passed
    await LiveSpace.updateMany(
        { type: 'Scheduled', endDateTime: { $lte: now } },
        { eventStatus: 'Completed' }
    );

    // Update events to "Upcoming" if the start time has not yet passed
    await LiveSpace.updateMany(
        { type: 'Scheduled', startDateTime: { $gt: now } },
        { eventStatus: 'Upcoming' }
    );

    // Update Instant events to "Completed" if one hour has passed since creation
    await LiveSpace.updateMany(
        { type: 'Instant', createdAt: { $lte: oneHourAgo } },
        { eventStatus: 'Completed' }
    );

    await communityLiveSpaceModel.updateMany(
        { type: 'Instant', createdAt: { $lte: oneHourAgo } },
        { eventStatus: 'Completed' }
    )

    console.log('Live Space Event statuses updated');
};

// Schedule the task to run every minute
cron.schedule('* * * * *', updateEventStatuses);

// console.log('Cron job scheduled to update event statuses every minute');
