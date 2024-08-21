import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import back from "../../../assets/backarrow_icon.png";
import logo from "../../../assets/MainLogo_White.png";

export default function BasicQuestionStudent() {
  const [form, setForm] = useState({
    gender: "",
    dateOfBirth: "",
    city: "",
    currentAcademicStatus: "",
    major: "",
    degree: "",
    interestedSubjects: [""],
    institution: "",
  });

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

    if (name === "institution" && value === "Others") {
      setOtherInstitution(true);
    } else if (name === "institution") {
      setOtherInstitution(false);
    }
  };

  const handleArrayChange = (e, index, fieldName) => {
    const newArray = [...form[fieldName]];
    newArray[index] = e.target.value;
    setForm({
      ...form,
      [fieldName]: newArray,
    });
  };

  const addField = (fieldName) => {
    setForm({
      ...form,
      [fieldName]: [...form[fieldName], ""],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* City Dropdown */}
            <div className="mb-4">
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
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
            </div>

            {/* Institution Dropdown - based on selected city */}
            <div className="mb-4">
              <select
                name="institution"
                value={form.institution}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
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
            </div>

            {/* Other Institution Input */}
            {otherInstitution && (
              <div className="mb-4">
                <input
                  type="text"
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="Enter your institution"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}

            {/* Current Academic Status Dropdown */}
            <div className="mb-4">
              <select
                name="currentAcademicStatus"
                value={form.currentAcademicStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Current Academic Status
                </option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="PHD">PHD</option>
              </select>
            </div>

            {/* Major Dropdown */}
            <div className="mb-4">
              <select
                name="major"
                value={form.major}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Major
                </option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            {/* Degree Dropdown */}
            <div className="mb-4">
              <select
                name="degree"
                value={form.degree}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Degree
                </option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">
                  Software Engineering
                </option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            {/* Interested Subjects */}
            {form.interestedSubjects.map((subject, index) => (
              <div className="mb-4" key={index}>
                <select
                  value={subject}
                  onChange={(e) =>
                    handleArrayChange(e, index, "interestedSubjects")
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>
                    Select Interested Subject
                  </option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Human Computer Interaction">
                    Human Computer Interaction
                  </option>
                  <option value="Software Development">
                    Software Development
                  </option>
                  <option value="Data Science">Data Science</option>
                  <option value="Networking">Networking</option>
                </select>
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
