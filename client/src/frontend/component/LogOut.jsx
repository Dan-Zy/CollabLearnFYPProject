import { Import } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cross from "../../assets/cross_icon1.png";
import axios from "axios";
import UpdateProfileModal from "./UpdateUser";

export function LogOut({ handleSetActiveItem }) { // Accept the function as a prop
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const image = userInfo.profilePicture;

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
      
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isModalOpen, userInfo]);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleClick = async (event) => {
    event.preventDefault();
    
    console.log("Logout Click");

    const response = await axios.get(
      "http://localhost:3001/collablearn/user/logout"
    );

    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    
    navigate("/"); // Redirect to the login page or any other page as needed
  };

  return (
    <>
      <div className="flex justify-center border-b-2 p-1 border-indigo-100 items-center cursor-pointer "  onClick={toggleModal}>
        <img
          src={image ? `http://localhost:3001/${image}` : 'https://via.placeholder.com/40'}
          alt="Profile"
          className="flex rounded-full w-12 h-12 mr-3  border border-indigo-500 p-1"
        />

        <div>
          <h4 className=" flex font-semibold">{userInfo.username || "User"}</h4>
          <p className="flex text-sm text-gray-500">{userInfo.role || "Role"}</p>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="absolute right-60 flex items-center justify-center z-50 rounded-lg shadow-lg"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-4 w-full max-w-xs md:max-w-sm lg:max-w-md border rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200" 
                 onClick={() => handleSetActiveItem('Profile')}>
              <img
                src={image ? `http://localhost:3001/${image}` : 'https://via.placeholder.com/40'}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-indigo-600"
              />
              <p className="ml-2">My Profile</p>
            </div>
            <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
             <UpdateProfileModal/>
            </div>
            <a href="/" onClick={handleClick}>
              <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
                <p>Log out</p>
              </div>
            </a>
            <img
              src={cross}
              alt="Close"
              className="w-3 h-3 absolute top-2 right-2 cursor-pointer"
              onClick={toggleModal}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default LogOut;
