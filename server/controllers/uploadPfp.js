import User from "../models/userModel.js";

export const uploadProfilePicture = async (req , res) => {
    try {

        const userId = req.user._id;
        const {profilePicture} = req.body;
        const filePath = req.file.path;

        const user = await User.findByIdAndUpdate(userId, { profilePicture: filePath } , {new: true});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile Picture Uploaded Successfully",
            data: user
        })
        
    } catch (error) {
        console.log("Server Error: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        })
    }
}