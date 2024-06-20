import User from '../../models/userModel.js';

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.redirect('http://localhost:5173/welcome');
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Error verifying email');
    }
};

export { verifyEmail };
