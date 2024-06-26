import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/MainLogo_White.png";
import { CSSTransition } from "react-transition-group";

export default function SetPhotos() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, role, form } = location.state;
  const [profilePic, setProfilePic] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [inProp, setInProp] = useState(true);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    setProfilePic(file);
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    setCoverPhoto(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("username", userInfo.name);
      formData.append("email", userInfo.email);
      formData.append("password", userInfo.password);
      formData.append("role", role);
      if (profilePic) formData.append("profilePhoto", profilePic);
      if (coverPhoto) formData.append("coverPhoto", coverPhoto);
      formData.append("bio", userInfo.bio || "");
      if (role === "Student") {
        formData.append("studentDetails", JSON.stringify(form));
      } else if (role === "Faculty Member") {
        formData.append("facultyDetails", JSON.stringify(form));
      } else if (role === "Industrial Professional") {
        formData.append("industrialDetails", JSON.stringify(form));
      }

      const response = await axios.post(
        "http://localhost:3001/collablearn/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("User registered successfully");
        const { token } = response.data;
        localStorage.setItem("token", token); // Store token in localStorage
        setInProp(false);
        setTimeout(() => {
          navigate("/verify-email");
        }, 500);
      }
    } catch (error) {
      console.error("There was an error registering the user!", error);
    }
  };

  const displayFormData = () => (
    <div className="flex flex-col text-left">
      <p>Name: {userInfo.name}</p>
      <p>Email: {userInfo.email}</p>
      <h3>Role: {role}</h3>
      {Object.entries(form).map(([key, value]) =>
        Array.isArray(value) ? (
          value.map((item, index) => (
            <p key={index}>{`${key} ${index + 1}: ${item}`}</p>
          ))
        ) : (
          <p key={key}>{`${key}: ${value}`}</p>
        )
      )}
    </div>
  );

  return (
    <CSSTransition in={inProp} timeout={500} classNames="fade" unmountOnExit>
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="flex flex-1 flex-col items-center bg-gradient-to-r from-indigo-600 to-indigo-400 p-2">
          <div>
            <img src={logo} alt="Logo" className="w-1/2 lg:w-1/4" />
          </div>
          <div className="flex flex-1 flex-col justify-center items-center text-center text-white">
            <h2 className="text-5xl font-bold">Be a Collabler</h2>
            <p className="mt-4 text-l">Your Information here</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center p-8 bg-white relative">
          <div className="relative w-full h-48">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
              className="absolute opacity-0 cursor-pointer w-full h-48"
              style={{ top: 0, left: 0 }}
            />
            {coverPhoto ? (
              <img
                src={URL.createObjectURL(coverPhoto)}
                alt="Cover"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                <p>Upload Cover Photo</p>
              </div>
            )}
          </div>
          <div className="absolute top-36 lg:top-36 transform -translate-x-1/2 left-1/2">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="absolute opacity-0 cursor-pointer w-24 h-24 rounded-full"
              style={{ top: 0, left: 0 }}
            />
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white"
              />
            ) : (
              <div className="bg-gray-200 w-24 h-24 rounded-full border-4 border-white flex items-center justify-center">
                <p>Upload Profile Pic</p>
              </div>
            )}
          </div>
          <div className="mt-10 w-full overflow-y-auto scroll max-h-screen no-scrollbar">
            <h3 className="text-indigo-400 font-bold text-2xl border-indigo-300 border-b-2">
              User Info
            </h3>
            {displayFormData()}
            <button
              type="button"
              className="w-[70%] m-2 bg-gradient-to-r from-indigo-600 to-indigo-400 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Ready to SignUp
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
