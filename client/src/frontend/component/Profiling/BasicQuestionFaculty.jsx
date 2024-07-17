import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import back from "../../../assets/backarrow_icon.png";
import logo from "../../../assets/MainLogo_White.png";

export default function BasicQuestionFaculty() {
  const [form, setForm] = useState({
    highestQualification: "",
    lastDegreeMajor: "",
    degree: "",
    currentlyTeachingAt: "",
    academicPosition: "",
    coursesCurrentlyTeaching: [""],
    researchInterests: [""],
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
    // console.log("Role: ", role);
    // console.log("Form: ", form);
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
                name="highestQualification"
                value={form.highestQualification}
                onChange={handleChange}
                placeholder="Highest Qualification"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="lastDegreeMajor"
                value={form.lastDegreeMajor}
                onChange={handleChange}
                placeholder="Last Degree Major"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="Degree"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="currentlyTeachingAt"
                value={form.currentlyTeachingAt}
                onChange={handleChange}
                placeholder="Currently Teaching At"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="academicPosition"
                value={form.academicPosition}
                onChange={handleChange}
                placeholder="Academic Position"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <p className="text-indigo-300 pt-5 pb-10">
              ____________________________
            </p>
            {form.coursesCurrentlyTeaching.map((course, index) => (
              <div className="mb-4 " key={index}>
                <input
                  type="text"
                  value={course}
                  onChange={(e) =>
                    handleArrayChange(e, index, "coursesCurrentlyTeaching")
                  }
                  placeholder="Course Currently Teaching"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("coursesCurrentlyTeaching")}
              className="mb-4 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Course
            </button>
            <p className="text-indigo-300 pt-5 pb-10">
              ____________________________
            </p>
            {form.researchInterests.map((interest, index) => (
              <div className="mb-4" key={index}>
                <input
                  type="text"
                  value={interest}
                  onChange={(e) =>
                    handleArrayChange(e, index, "researchInterests")
                  }
                  placeholder="Research Interest"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("researchInterests")}
              className="mb-4 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Research Interest
            </button>
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
