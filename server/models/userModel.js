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

    occupation: {
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
        type: Number,
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

    role: {
        type: String,
        required: true,
        enum: ['Student' , 'Faculty Member' , 'Industrial Professional']
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

    studentDetails: {
        type: studentSchema,
        required: function(){
            return this.role === "Student";
        }
    },

    facultyDetails: {
        type: facultySchema,
        required: function(){
            return this.role === "Faculty Member"
        }
    },

    industrialDetails: {
        type: industrialSchema,
        required: function(){
            return this.role === "Industrial Professional"
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