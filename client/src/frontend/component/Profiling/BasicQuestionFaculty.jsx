import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import back from "../../../assets/backarrow_icon.png";
import logo from "../../../assets/MainLogo_White.png";

export default function BasicQuestionFaculty() {
  const [form, setForm] = useState({
    gender: "",
    dateOfBirth: "",
    city: "",
    highestQualification: "",
    lastDegreeMajor: "",
    degreeSubject: "", // Updated field name
    currentlyTeachingAt: "",
    academicPosition: "",
    coursesCurrentlyTeaching: [""],
    researchInterests: [""],
    interestedSubjects: [""],
  });

  const [errors, setErrors] = useState({});
  const [otherInstitution, setOtherInstitution] = useState(false);

  const institutionsByCity = {
    Lahore: [
      "Punjab University",
      "Lahore University of Management Sciences (LUMS)",
    ],
    Gujranwala: ["IISAT", "Punjab University (GRW Campus)", "GIFT University"],
    Islamabad: [
      "National University of Sciences and Technology (NUST)",
      "Quaid-i-Azam University",
    ],
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, role } = location.state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (name === "currentlyTeachingAt" && value === "Others") {
      setOtherInstitution(true);
    } else if (name === "currentlyTeachingAt") {
      setOtherInstitution(false);
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleArrayChange = (e, index, fieldName) => {
    const newArray = [...form[fieldName]];
    newArray[index] = e.target.value;
    setForm({
      ...form,
      [fieldName]: newArray,
    });

    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const addField = (fieldName) => {
    setForm({
      ...form,
      [fieldName]: [...form[fieldName], ""],
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = [
      "gender",
      "dateOfBirth",
      "city",
      "highestQualification",
      "lastDegreeMajor",
      "degreeSubject", // Updated field name
      "currentlyTeachingAt",
      "academicPosition",
    ];

    fieldsToValidate.forEach((field) => {
      if (!form[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    const enteredYear = new Date(form.dateOfBirth).getFullYear();
    if (enteredYear >= 2006) {
      newErrors.dateOfBirth = "Date of Birth must be before 2006.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    navigate("/SetProfileImage", { state: { userInfo, role, form } });
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen min-h-screen">
      <div className="flex flex-1 flex-col items-center bg-gradient-to-r from-indigo-600 to-indigo-400 p-2">
        <div className="mb-5">
          <img src={logo} alt="Logo" className="w-1/2 lg:w-1/4" />
        </div>
        <div className="flex flex-1 flex-col justify-center items-center text-center text-white">
          <p className="text-xl">
            Let me know about{" "}
            <span className="font-bold text-3xl">Yourself</span>
            ___________________
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start items-center p-8 bg-white overflow-y-auto max-h-screen">
        <div className="mb-8 w-full max-w-md">
          <img
            src={back}
            alt="Back"
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-400">
            Set Up Your <span className="font-semibold">Profile</span>
          </h2>
        </div>

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit}>
            {/* Gender Dropdown */}
            <div className="mb-4">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.gender ? "border-red-500" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.dateOfBirth ? "border-red-500" : ""
                }`}
                required
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* City Dropdown */}
            <div className="mb-4">
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.city ? "border-red-500" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select City
                </option>
                {Object.keys(institutionsByCity).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>

            {/* Highest Qualification Dropdown */}
            <div className="mb-4">
              <select
                name="highestQualification"
                value={form.highestQualification}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.highestQualification ? "border-red-500" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Highest Qualification
                </option>
                <option value="Masters">Masters</option>
                <option value="PHD">PHD</option>
              </select>
              {errors.highestQualification && (
                <p className="text-red-500 text-sm">
                  {errors.highestQualification}
                </p>
              )}
            </div>

            {/* Last Degree Major Dropdown */}
            <div className="mb-4">
              <select
                name="lastDegreeMajor"
                value={form.lastDegreeMajor}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.lastDegreeMajor ? "border-red-500" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Last Degree Major
                </option>
                <option value="Computer Science">Computer Science</option>
              </select>
              {errors.lastDegreeMajor && (
                <p className="text-red-500 text-sm">{errors.lastDegreeMajor}</p>
              )}
            </div>

            {/* Degree Subject Dropdown */}
            <div className="mb-4">
              <select
                name="degreeSubject" // Updated field name
                value={form.degreeSubject} // Updated field name
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.degreeSubject ? "border-red-500" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Degree Subject
                </option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">
                  Software Engineering
                </option>
                <option value="Data Science">Data Science</option>
              </select>
              {errors.degreeSubject && (
                <p className="text-red-500 text-sm">{errors.degreeSubject}</p>
              )}
            </div>

            {/* Currently Teaching At Dropdown */}
            <div className="mb-4">
              <select
                name="currentlyTeachingAt"
                value={form.currentlyTeachingAt}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.currentlyTeachingAt ? "border-red-500" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Institution
                </option>
                {form.city &&
                  institutionsByCity[form.city]?.map((institution) => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                <option value="Others">Others</option>
              </select>
              {errors.currentlyTeachingAt && (
                <p className="text-red-500 text-sm">
                  {errors.currentlyTeachingAt}
                </p>
              )}
            </div>

            {/* Other Institution Input */}
            {otherInstitution && (
              <div className="mb-4">
                <input
                  type="text"
                  name="currentlyTeachingAt"
                  value={form.currentlyTeachingAt}
                  onChange={handleChange}
                  placeholder="Enter your institution"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}

            {/* Academic Position Dropdown */}
            <div className="mb-4">
              <select
                name="academicPosition"
                value={form.academicPosition}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.academicPosition ? "border-red-500" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select Academic Position
                </option>
                <option value="Lab Instructor">Lab Instructor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
              </select>
              {errors.academicPosition && (
                <p className="text-red-500 text-sm">
                  {errors.academicPosition}
                </p>
              )}
            </div>

            {/* Courses Currently Teaching */}
            {form.coursesCurrentlyTeaching.map((course, index) => (
              <div className="mb-4" key={index}>
                <select
                  value={course}
                  onChange={(e) =>
                    handleArrayChange(e, index, "coursesCurrentlyTeaching")
                  }
                  className={`w-full p-2 border border-gray-300 rounded ${
                    errors.coursesCurrentlyTeaching ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="" disabled>
                    Select Course Currently Teaching
                  </option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Database Management Systems">
                    Database Management Systems
                  </option>
                  <option value="Programming Fundamentals">
                    Programming Fundamentals
                  </option>
                  <option value="Data Structures and Algorithms">
                    Data Structures and Algorithms
                  </option>
                  <option value="Object Oriented Programming">
                    Object Oriented Programming
                  </option>
                  <option value="Object Oriented Analysis & Design">
                    Object Oriented Analysis & Design
                  </option>
                  <option value="Software Requirement Engineering">
                    Software Requirement Engineering
                  </option>
                  <option value="Human Computer Interaction">
                    Human Computer Interaction
                  </option>
                  <option value="Others">Others</option>
                </select>
                {errors.coursesCurrentlyTeaching && (
                  <p className="text-red-500 text-sm">
                    {errors.coursesCurrentlyTeaching[index]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("coursesCurrentlyTeaching")}
              className="mb-4 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Course
            </button>

            {/* Research Interests */}
            {form.researchInterests.map((interest, index) => (
              <div className="mb-4" key={index}>
                <select
                  value={interest}
                  onChange={(e) =>
                    handleArrayChange(e, index, "researchInterests")
                  }
                  className={`w-full p-2 border border-gray-300 rounded ${
                    errors.researchInterests ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="" disabled>
                    Select Research Interest
                  </option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Networking">Networking</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Development">
                    Software Development
                  </option>
                  <option value="Human Computer Interaction">
                    Human Computer Interaction
                  </option>
                </select>
                {errors.researchInterests && (
                  <p className="text-red-500 text-sm">
                    {errors.researchInterests[index]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("researchInterests")}
              className="mb-4 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Research Interest
            </button>

            {/* Interested Subjects */}
            {form.interestedSubjects.map((subject, index) => (
              <div className="mb-4" key={index}>
                <select
                  value={subject}
                  onChange={(e) =>
                    handleArrayChange(e, index, "interestedSubjects")
                  }
                  className={`w-full p-2 border border-gray-300 rounded ${
                    errors.interestedSubjects ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="" disabled>
                    Select Interested Subject
                  </option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Networking">Networking</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Development">
                    Software Development
                  </option>
                  <option value="Human Computer Interaction">
                    Human Computer Interaction
                  </option>
                </select>
                {errors.interestedSubjects && (
                  <p className="text-red-500 text-sm">
                    {errors.interestedSubjects[index]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("interestedSubjects")}
              className="mb-4 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Interested Subject
            </button>

            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
