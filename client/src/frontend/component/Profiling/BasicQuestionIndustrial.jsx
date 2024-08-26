import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import back from "../../../assets/backarrow_icon.png";
import logo from "../../../assets/MainLogo_White.png";

export default function BasicQuestionIndustrial() {
  const [form, setForm] = useState({
    gender: "",
    dateOfBirth: "",
    city: "",
    profession: "",
    designation: "",
    currentlyWorkingAt: "",
    yearsOfExperience: "",
    interestedSubjects: [""],
  });

  const [otherCompany, setOtherCompany] = useState(false);
  const [dobError, setDobError] = useState("");

  const companiesByCity = {
    Lahore: ["NETSOL Technologies", "Systems Limited", "Techlogix"],
    Gujranwala: ["Tech Fyp", "Clustox", "Stack Resources"],
    Islamabad: ["Elixir Technologies", "Ovex Technologies", "LMKR"],
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

    if (name === "currentlyWorkingAt" && value === "Others") {
      setOtherCompany(true);
    } else if (name === "currentlyWorkingAt") {
      setOtherCompany(false);
    }

    if (name === "dateOfBirth") {
      validateDOB(value);
    }
  };

  const validateDOB = (date) => {
    const selectedDate = new Date(date);
    const minDate = new Date("2006-01-01");
    if (selectedDate >= minDate) {
      setDobError("Date of Birth must be later than January 1, 2006.");
    } else {
      setDobError("");
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

    // Final validation check before submission
    if (dobError || !form.dateOfBirth || new Date(form.dateOfBirth) <= new Date("2018-01-01")) {
      validateDOB(form.dateOfBirth);
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
              {dobError && <p className="text-red-500">{dobError}</p>}
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
                {Object.keys(companiesByCity).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Profession Dropdown */}
            <div className="mb-4">
              <select
                name="profession"
                value={form.profession}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Profession
                </option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            {/* Designation Dropdown */}
            <div className="mb-4">
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Designation
                </option>
                <option value="Owner">Owner</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Web Developer">Web Developer</option>
                <option value="App Developer">App Developer</option>
                <option value="Game Developer">Game Developer</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Currently Working At Dropdown */}
            <div className="mb-4">
              <select
                name="currentlyWorkingAt"
                value={form.currentlyWorkingAt}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Company
                </option>
                {form.city &&
                  companiesByCity[form.city]?.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Other Company Input */}
            {otherCompany && (
              <div className="mb-4">
                <input
                  type="text"
                  name="currentlyWorkingAt"
                  value={form.currentlyWorkingAt}
                  onChange={handleChange}
                  placeholder="Enter your company"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}

            {/* Years of Experience Dropdown */}
            <div className="mb-4">
              <select
                name="yearsOfExperience"
                value={form.yearsOfExperience}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Years of Experience
                </option>
                <option value="below 1 year">below 1 year</option>
                <option value="1 to 3 years">1 to 3 years</option>
                <option value="3 to 5 years">3 to 5 years</option>
                <option value="above 5 years">above 5 years</option>
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
                  <option value="Networking">Networking</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Development">
                    Software Development
                  </option>
                  <option value="Human Computer Interaction">
                    Human Computer Interaction
                  </option>
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
