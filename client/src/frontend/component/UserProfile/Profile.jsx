/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import profileImage from "../../../assets/OIF.jfif";
import jwt_decode from "jwt-decode";
export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const id = location.state?.id;

  useEffect(() => {
    console.log("Profile component mounted with id:", id);

    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const decodedToken = jwt_decode(token);
      console.log("Fetching user info for id:", id);
      try {
        const userInfoResponse = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const userInfo = userInfoResponse.data;
        setUserInfo(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (id) {
      getUser();
    } else {
      console.error("No id provided");
    }
  }, [id]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      {/* Profile Header */}
      <div
        className="bg-gradient-to-b from-gray-300 to-gray-200 h-48 relative"
        id="div2"
      >
        <div className="absolute bottom-6 left-6 transform translate-y-1/2">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>
        <div className="absolute bottom-0 left-32 p-0">
          <h1 className="text-xl font-bold">Daniyal Zafar Malik</h1>
          <p className="text-gray-600">@daniyalBoy</p>
        </div>
      </div>
      {/* Stats */}
      <div className="flex justify-around mt-5 text-center">
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

      <div className="flex flex-col md:flex-row mt-8 space-y-4 md:space-y-0 md:space-x-4">
        {/* About Me Section */}
        <div className="">
          <div
            className="flex-1 md:w-1/4 bg-white p-4 rounded-lg shadow"
            id="div3"
          >
            <h2 className="text-lg font-bold mb-4">About Me</h2>
            <ul className="space-y-2 text-gray-700">
              <li>SGT Miranda McAnderson6543</li>
              <li>www.GBBS.com</li>
              <li>Narside Softserve company</li>
              <li>20, June, 2018</li>
            </ul>
          </div>

          <div
            className="flex-1 md:w-1/4 bg-white p-4 rounded-lg shadow"
            id="div4"
          >
            <h2 className="text-lg font-bold mb-4">Image/Video</h2>
            <div
              className="grid grid-cols-3 gap-2 overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
              <img
                src="image1.jpg"
                alt="Image 1"
                className="w-full h-auto rounded"
              />
              <img
                src="image2.jpg"
                alt="Image 2"
                className="w-full h-auto rounded"
              />
              <img
                src="image3.jpg"
                alt="Image 3"
                className="w-full h-auto rounded"
              />
              <img
                src="image4.jpg"
                alt="Image 4"
                className="w-full h-auto rounded"
              />
              <img
                src="image5.jpg"
                alt="Image 5"
                className="w-full h-auto rounded"
              />
              <img
                src="image6.jpg"
                alt="Image 6"
                className="w-full h-auto rounded"
              />
            </div>
            <a href="#" className="text-blue-500 mt-4 block">
              See All
            </a>
          </div>
        </div>
        {/* Posts Section */}
        <div
          className="flex-1 md:w-1/2 bg-white p-4 rounded-lg shadow"
          id="div1"
        >
          <h2 className="text-lg font-bold mb-4">Post SomeThing</h2>
          <input
            type="text"
            placeholder="Write.............."
            className="w-full p-2 border rounded mb-4"
          />
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">Daniyal Zafar Malik</h3>
              <p>Sat - 21/02/24 at 11:34am</p>
              <p>
                Can someone please let me know what is the error in this piece
                of code?
              </p>
              <div className="flex space-x-4 mt-2">
                <span>👍 478</span>
                <span>💬 11</span>
                <span>🔁 59</span>
                <span>📤 5</span>
              </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">Daniyal Zafar Malik</h3>
              <p>Sat - 21/02/24 at 11:34am</p>
              <p>what you think man JUST DO IT</p>
              <div className="flex space-x-4 mt-2">
                <span>👍 478</span>
                <span>💬 11</span>
                <span>🔁 59</span>
                <span>📤 5</span>
              </div>
            </div>
          </div>
        </div>
        {/* Image/Video Section */}
      </div>
    </div>
  );
}
