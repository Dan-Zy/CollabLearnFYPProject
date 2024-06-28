import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const [userInfo, setUserInfo] = useState(null);
  const [image, setImage] = useState("https://via.placeholder.com/40");
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const decodedToken = jwt_decode(token);
      try {
        const userInfoResponse = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${decodedToken.id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const userInfo = userInfoResponse.data;
        console.log("UserInfo: ", userInfo);

        localStorage.setItem("userInfo", JSON.stringify(userInfo.user));
        setUserInfo(userInfo.user);
        if (userInfo.user.profilePicture) {
          setImage(userInfo.user.profilePicture);
        }

        setLoading(false);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }, 600);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div
        className={`flex flex-1 flex-col h-screen text-bold justify-center items-center text-center text-white italic bg-gradient-to-r from-indigo-600 to-indigo-400 transition-opacity duration-1000 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        Loading...
      </div> 
    );
  }

  return (
    <div
      className={`flex flex-1 flex-col h-screen justify-center items-center text-center bg-gradient-to-r from-indigo-600 to-indigo-400 transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex w-screen flex-col justify-center items-center text-center">
        <img
          src={
            image
              ? `http://localhost:3001/${image}`
              : "https://via.placeholder.com/40"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white"
        />
        <h4 className="mb-5 text-xl font-bold text-white italic">
          {userInfo.username}
        </h4>
      </div>
      <h1 className="flex text-white italic font-bold text-4xl justify-center items-center text-center">
        Welcome To Collablearn
      </h1>
    </div>
  );
}
