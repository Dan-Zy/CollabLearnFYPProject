// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";

// export const verifyToken = async (req, res, next) => {

//     try {
        
//         let token = req.header("Authorization");

//         if(!token){
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized Access. Token is missing"
//             })
//         }

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
//             console.log("DECODED ", decoded);
      
//             const user = await User.findById(decoded._id);
      
//             if (!user) {
//               return res
//                 .status(401)
//                 .json({ success: false, message: "Unauthorized Access" });
//             }
      
//             req.userId = decoded._id;
//             req.user = user; // Set the user in the request object
//             next();

//           } catch (error) {
            
//             console.log(error.message);
      
//             if (error.message === "jwt expired") {
//               console.log("Token expired");
//               return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized. Token expired.",
//               });
//             } else {
//               console.log("Invalid token");
//               return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized Access! Invalid token.",
//               });
//             }
//           }


//     } catch (error) {
//         console.log("Error while verifying Token: ", error);
//         res.status(500).send({
//             succes: false,
//             message: "Internal Server Error"
//         })
//     }

// }





import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. Token is missing"
            });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ success: false, message: "Unauthorized Access" });
            }
            req.userId = decoded.id;
            req.user = user;
            
            next();
            
        } catch (error) {
            if (error.message === "jwt expired") {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Token expired.",
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access! Invalid token.",
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
}


export const verifyBearerToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. Token is missing"
            });
        }

        // Ensure the token starts with "Bearer "
        if (token.startsWith("Bearer ")) {
            // Remove 'Bearer ' prefix
            token = token.split(" ")[1];
        } else {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. Invalid token format"
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ success: false, message: "Unauthorized Access" });
            }
            req.userId = decoded.id;
            req.user = user;
            
            next();
            
        } catch (error) {
            if (error.message === "jwt expired") {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Token expired.",
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access! Invalid token.",
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};
