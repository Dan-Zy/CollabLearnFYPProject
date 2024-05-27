    import jwt from "jsonwebtoken";
    import { hashPassword, comparePassword } from "../../helpers/userHelper.js";
    import User from "../../models/userModel.js";

    // REGISTER USER
    const registerUser = async (req , res) => {
        try {
            const { username, email, password, role, profilePicture, coverPicture, bio, isActive, studentDetails, facultyDetails, industrialDetails } = req.body;

            // Check user must enter essential fields
            if (!username || !email || !password || !role) {
                return res.status(400).send({ message: "All fields are Required" });
            };

            const existingEmail = await User.findOne({ email });
            if(existingEmail){
                return res.status(200).send({
                    success: true,
                    message: "User already exist. Please Login"
                });
            };

            const hashedPassword = await hashPassword(password);

            const newUser = new User({
                username, 
                email, 
                password: hashedPassword, 
                role, 
                profilePicture, 
                coverPicture, 
                bio, 
                isActive, 
                studentDetails, 
                facultyDetails, 
                industrialDetails
            });

            // Save the User in the database using save function of User Schema 
            const savedUser = await newUser.save();

            res.status(201).send({
                success: true,
                message: "User Registered Successfully",
                user: savedUser
            });

        }
        
        catch (error) {
        console.log("Error in Signup: ", error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })   
        }
    };


    // LOGIN USER

    const loginUser = async (req , res) => {

        try {
            const {email , password} = req.body;

            // VALIDATION
            if(!email || !password){
                return res.status(400).send({
                    success: false,
                    message: "Invalid Email or Password"
                })
            }

            // CHECK USER
            const user = await User.findOne({ email: email });

            if(!user){
                return res.status(401).send({
                    success: false,
                    message: "Email is not Registered"
                })
            }

            // PASSWORD CHECKING
            const match = await comparePassword(password, user.password);
            if(!match){
                return res.status(401).send({
                    success: false,
                    message: "Incorrect Password"
                })
            }

            const token = await jwt.sign( {id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"} );

            res.status(200).send({
                success: true,
                message: "Login Successfully",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token,
            });

        } 
        
        catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error in Login",
                error
            });
        }

    };


    const logoutUser = async (req, res) => {
        try {
            // JWT tokens are stateless, so the only thing we need to do on logout
            // is to return a successful response.
            res.status(200).send({
                success: true,
                message: "Logout Successfully"
            });
        } catch (error) {
            console.log("Error in Logout: ", error);
            res.status(500).send({
                success: false,
                message: "Error in Logout",
                error
            });
        }
    };
    
    

    export { registerUser, loginUser, logoutUser};