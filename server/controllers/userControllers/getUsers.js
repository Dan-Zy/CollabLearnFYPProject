import User from "../../models/userModel.js";

const getUsers = async (req, res) => {

    try {
        
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "Users data has been fetched successfully",
            length: users.length,
            data: users,
        })

    } catch (error) {
        console.log("Error while fetching all user's data: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default getUsers;