import cron from 'node-cron';
import User from '../models/userModel.js';

// Schedule task to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    try {
        const expiredUsers = await User.deleteMany({
            verificationTokenExpires: { $lt: Date.now() },
            isVerified: { $ne: true }
        });

        console.log(`Cleanup task executed. Deleted ${expiredUsers.deletedCount} expired unverified users.`);
    } catch (error) {
        console.error('Error executing cleanup task:', error);
    }
});
