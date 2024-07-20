import User from "../../models/userModel.js";

const updateUser = async (req, res) => {

    try {
        
        const { userId } = req.params;
        const reqUserId = req.userId;
        const updatedData = req.body;

        console.log("Params User ID: ", userId);
        console.log("User ID: ", reqUserId);

        if(userId !== reqUserId){
            return res.status(401).json({
                success: false,
                message: "You are not authorized to update this profile"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId , updatedData , { new: true });

       
        return res.status(201).json({
            success: true,
            message: "User updated successfully",
            updatedUser
        });



    } catch (error) {
        console.log("Error updating user: ", error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }

}

export default updateUser;