import User from "../../models/userModel.js";

const getAllCollablersById = async (req, res) => {
    try {
        // Extract the userId from the request parameters
        const { userId } = req.params;

        // Find the user by their ID
        const user = await User.findById(userId);

        // If the user doesn't exist, return an error response
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Populate the collablers field with username, role, and profilePicture
        const populatedUser = await user.populate({
            path: 'collablers',
            select: 'username role profilePicture'
        });

        // Extract the populated collablers
        const collablers = populatedUser.collablers.map(collabler => ({
            name: collabler.username,
            role: collabler.role,
            img: collabler.profilePicture,
        }));

        // Return the collablers in the response
        res.status(200).json({
            success: true,
            collablers: collablers,
                    
        });

    } catch (error) {
        console.log("Internal server error: ", error);
        res.status(500).json({
            success: false,
            message: "Error while fetching collablers"
        });
    }
};

export default getAllCollablersById;
