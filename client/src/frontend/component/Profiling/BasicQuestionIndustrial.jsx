import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import back from "../../../assets/backarrow_icon.png";
import logo from "../../../assets/MainLogo_White.png";

export default function BasicQuestionIndustrial() {
  const [form, setForm] = useState({
    profession: "",
    occupation: "",
    designation: "",
    currentlyWorkingAt: "",
    yearsOfExperience: "",
    interestedSubjects: [""],
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, role } = location.state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
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
    console.log("Role: ", role);
    e.preventDefault();
    navigate("/SetProfileImage", { state: { userInfo, role, form } });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
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
            <div className="mb-4">
              <input
                type="text"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="Profession"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                placeholder="Occupation"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="currentlyWorkingAt"
                value={form.currentlyWorkingAt}
                onChange={handleChange}
                placeholder="Currently Working At"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                name="yearsOfExperience"
                value={form.yearsOfExperience}
                onChange={handleChange}
                placeholder="Years of Experience"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <p className="text-indigo-300 pt-5 pb-10">
              ____________________________
            </p>
            {form.interestedSubjects.map((subject, index) => (
              <div className="mb-4" key={index}>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) =>
                    handleArrayChange(e, index, "interestedSubjects")
                  }
                  placeholder="Interested Subject"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
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
