import User from "../../models/userModel.js";

const getUser = async (req, res) => {

    try {
        
        const reqUserId = req.userId;
        const { userId } = req.params;

        console.log("Req User ID: ", typeof(reqUserId));
        console.log("Param User ID: ", typeof(userId));

        // if(reqUserId !== userId){
        //     return res.status(400).json({
        //         success: false,
        //         message: "You are not authorized to fetch this user's data"
        //     });
        // }

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success: false,
                message: "There is no user found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User's data fetched successfully",
            user: user
        });

    } catch (error) {
        console.log("Error while fetching user's data: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default getUser;


// if (userInfo.role === 'Student') {
//     postData.append('Role', userInfo.role);
//     postData.append('Degree', userInfo.studentDetails.currentAcademicStatus);
//     postData.append('Subject', userInfo.studentDetails.degreeSubject);
//     userInfo.studentDetails.interestedSubjects.forEach(interest => postData.append('Interests', interest));
//   } else if (userInfo.role === 'Faculty') {
//     postData.append('Role', userInfo.role);
//     postData.append('Degree', userInfo.facultyDetails.highestQualification);
//     postData.append('Subject', userInfo.facultyDetails.degreeSubject);
//     userInfo.facultyDetails.interestedSubjects.forEach(interest => postData.append('Interests', interest));
//   } else if (userInfo.role === 'Industrial') {
//     postData.append('Role', userInfo.role);
//     postData.append('Degree', userInfo.industrialDetails.highestQualification);
//     postData.append('Subject', userInfo.industrialDetails.degreeSubject);
//     userInfo.industrialDetails.interestedSubjects.forEach(interest => postData.append('Interests', interest));
//   }