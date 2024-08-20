import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

    currentAcademicStatus: {
        type: String,
        required: true,
    },

    major: {
        type: String,
        required: true,
    },

    degree: {
        type: String,
        required: true
    },

    interestedSubjects: [String],

    institution: {
        type: String,
        required: true,
    },

});


const facultySchema = new mongoose.Schema({

    highestQualification: {
        type: String,
        required: true
    },

    lastDegreeMajor: {
        type: String,
        required: true
    },

    degree: {
        type: String,
        required: true
    },

    currentlyTeachingAt: {
        type: String,
        required: true
    },

    academicPosition: {
        type: String,
        required: true
    },

    coursesCurrentlyTeaching: [String],

    researchInterests: [String],

    interestedSubjects: [String]

});


const industrialSchema = new mongoose.Schema({

    profession: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    currentlyWorkingAt: {
        type: String,
        required: true
    },

    interestedSubjects: {
        type: [String],
        required: true
    },

    yearsOfExperience: {
        type: String,
        required: true
    }

});


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        // required: true,
        enum: ["Male", "Female", "Other"]
    },

    dateOfBirth: {
        type: Date,
        // required: true,
        set: (date) => {
        // Normalize the date to midnight
        const normalizedDate = new Date(date);
        normalizedDate.setUTCHours(0, 0, 0, 0);
        return normalizedDate;
        } 
    },

    city: {
        type: String,
        // required: true
    },

    role: {
        type: String,
        required: true,
        enum: ['Student' , 'Faculty' , 'Industrial']
    },

    profilePicture: {
        type: String,
        default: "",
    },

    coverPicture: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        min: 2,
        max: 50,
    },

    isActive: {
        type: Boolean,
        default: true
    },

    sendedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    receivedRequests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        seen: {
            type: Boolean,
            default: false,
        }
    }],

    collablers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    recommendedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    studentDetails: {
        type: studentSchema,
        required: function(){
            return this.role === "Student";
        }
    },

    facultyDetails: {
        type: facultySchema,
        required: function(){
            return this.role === "Faculty"
        }
    },

    industrialDetails: {
        type: industrialSchema,
        required: function(){
            return this.role === "Industrial"
        }
    },

    verificationToken: {
        type: String,
        required: false
    },
    verificationTokenExpires: {
        type: Date,
        required: false
    }

}, 

{ timestamps: true }

);


const User = mongoose.model('User' , userSchema , 'users');

export default User;