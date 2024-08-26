import User from "../../models/userModel.js";
import { hashPassword, comparePassword } from "../../helpers/userHelper.js";

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const reqUserId = req.userId;
        const { username, oldPassword, newPassword } = req.body;

        console.log("Params User ID: ", userId);
        console.log("User ID: ", reqUserId);

        if (userId !== reqUserId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to update this profile"
            });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Handle username update
        if (username) {
            user.username = username;
        }

        // Handle password update
        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Old password is required to change the password"
                });
            }

            const isMatch = await comparePassword(oldPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect old password, try again"
                });
            }

            // Hash the new password and update it
            user.password = await hashPassword(newPassword);
        } else if (oldPassword && !newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password is required to change the password"
            });
        }

        // Save the updated user
        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            updatedUser
        });

    } catch (error) {
        console.log("Error updating user: ", error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

export default updateUser;
