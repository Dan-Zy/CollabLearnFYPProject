/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { PostCall } from "./userPost";
export default function Profile({ userId }) {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    console.log("Profile component mounted with id:", userId);

    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const decodedToken = jwt_decode(token);
      console.log("Fetching user info for id:", userId);
      try {
        const userInfoResponse = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${userId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const userInfo = userInfoResponse.data;
        setUserInfo(userInfo.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (userId) {
      getUser();
    } else {
      console.error("No id provided");
    }
  }, [userId]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const renderRoleSpecificInfo = () => {
    if (userInfo.role === 'Student') {
      return (
        <ul className="w-full justify-center items-center  text-gray-700">
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold text-s">Current Academic: </span>
            {userInfo.studentDetails.currentAcademicStatus}
          </li>
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Major: </span>
            {userInfo.studentDetails.major}
          </li>
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Degree: </span>
            {userInfo.studentDetails.degree}
          </li>
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Interested Subjects: </span>
            {userInfo.studentDetails.interestedSubjects}
          </li>
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Institution: </span>
            {userInfo.studentDetails.institution}
          </li>
        </ul>
      );
    } else if (userInfo.role === 'Faculty') {
      return (
        <ul className="space-y-2 text-gray-700">
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Current Academic Status: </span>
            {userInfo.facultyDetails.currentAcademicStatus}
          </li>
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Major: </span>
            {userInfo.facultyDetails.major}
          </li>
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Degree: </span>
            {userInfo.facultyDetails.degree}
          </li>
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Interested Subjects: </span>
            {userInfo.facultyDetails.interestedSubjects}
          </li>
          <li className="flex flex-row text-s">
            <span className="flex-1 font-semibold">Institution: </span>
            {userInfo.facultyDetails.institution}
          </li>
        </ul>
      );
    } else {
      return <p>Role not recognized</p>;
    }
  };

  return (
    <div className="max-w-5xl max-h-[54vh] mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      {/* Profile Header */}
      <div className="relative">
        <img
          src={userInfo.coverPhoto ? `http://localhost:3001/${userInfo.coverPhoto}` : 'https://via.placeholder.com/600x200'}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-6 left-6 transform translate-y-1/2">
          <img
            src={userInfo.profilePicture ? `http://localhost:3001/${userInfo.profilePicture}` : 'https://via.placeholder.com/40'}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>
        <div className="absolute bottom-0 left-32 p-0 ">
          <h1 className="text-xl font-bold text-left">{userInfo.username}</h1>
          <p className="text-gray-600 font-extralight text-xs text-left">{userInfo.email}</p>
        </div>
      </div>
      
      <div className="flex  justify-around mt-5 text-center">
        <div>
          <h2 className="text-lg font-bold">Post</h2>
          <p>1.2k</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Follower</h2>
          <p>1.2k</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Following</h2>
          <p>200</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Upvote</h2>
          <p>200k</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Devote</h2>
          <p>10k</p>
        </div>
      </div>

      <div className="flex flex-col w-full max-h-[10vh] md:flex-row mt-8 space-y-4 md:space-y-0 md:space-x-4">
        
        <div className="  text-indigo-500">
          <div
            className=" flex-1 text-left md:w-full bg-gradient-to-tr from-indigo-200 to-indigo-100 p-2 rounded-xl shadow-"
          >
            <h2 className=" text-lg font-bold mb-4">About Me</h2>
            {renderRoleSpecificInfo()}
          </div>

          
        </div>
        {/* Posts Section */}
        <div
          className="flex-1 h-full md:w-1/2 bg-white p-4 rounded-lg shadow"
        >
          <PostCall userId = {userId}/>
        </div>
        {/* Image/Video Section */}
      </div>
    </div>
  );
}
