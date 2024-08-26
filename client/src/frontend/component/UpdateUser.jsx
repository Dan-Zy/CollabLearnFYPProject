import React, { useState, useEffect, useRef } from "react";
import cross from '../../assets/cross_icon1.png';
import axios from "axios";
import Notification from './SystemNotification'; // Import the Notification component

export function UpdateProfileModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPicture, setIsSavingPicture] = useState(false);
  
  const [notification, setNotification] = useState({ message: "", type: "" }); // Notification state

  const fileInputRef = useRef(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    setFormData({
      username: userInfo.username || "",
      password: "",
      confirmPassword: "",
    });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      closeNotification();
    }, 3000); // Automatically close the notification after 3 seconds
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = "Weak";
    if (password.length >= 8) {
      if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
        strength = "Strong";
      } else {
        strength = "Medium";
      }
    }
    setPasswordStrength(strength);
  };

  const fetchUpdatedUserInfo = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3001/collablearn/user/getUser/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        const updatedUserInfo = response.data.user;
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        closeModal();
      }
    } catch (error) {
      console.error("Error fetching updated user info:", error);
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);

    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

    if (formData.password && formData.password !== formData.confirmPassword) {
      showNotification("Passwords do not match", "error");
      setIsSavingProfile(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const profileData = {
        username: formData.username,
      };

      if (formData.password) {
        profileData.password = formData.password;
      }

      const response = await axios.put(
        `http://localhost:3001/collablearn/user/updateProfile/${userInfo._id}`,
        profileData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await fetchUpdatedUserInfo(userInfo._id);
        showNotification("Profile updated successfully", "success");
        closeModal();
      } else {
        showNotification("Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Error updating profile", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProfilePictureSubmit = async (event) => {
    event.preventDefault();
    setIsSavingPicture(true);

    if (!profilePicture) {
      showNotification("Please select a profile picture to upload.", "error");
      setIsSavingPicture(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

      const profilePictureFormData = new FormData();
      profilePictureFormData.append("image", profilePicture);

      const pictureResponse = await axios.patch(
        "http://localhost:3001/collablearn/user/upload/pfp",
        profilePictureFormData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (pictureResponse.status === 200 || pictureResponse.status === 201) {
        await fetchUpdatedUserInfo(userInfo._id);
        showNotification("Profile picture updated successfully", "success");
      } else {
        showNotification("Failed to update profile picture", "error");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      showNotification("Error updating profile picture", "error");
    } finally {
      setIsSavingPicture(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <button
        className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        onClick={openModal}
      >
        Update Profile
      </button>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 modal-overlay"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
          >
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">Update Profile</h2>
              <img
                onClick={closeModal}
                src={cross}
                alt="Close"
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            {/* Profile Picture Update Form */}
            <form onSubmit={handleProfilePictureSubmit} className="mb-4">
              <div className="flex flex-col items-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  name="profilePicture"
                  onChange={handleProfilePictureChange}
                  ref={fileInputRef}
                  className="hidden" // Hide the file input
                />
                <div
                  className="relative cursor-pointer"
                  onClick={triggerFileInput} // Trigger file input on click
                >
                  {profilePicture ? (
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white"
                    />
                  ) : (
                    <div className="bg-gray-200 w-24 h-24 rounded-full border-4 border-white flex items-center justify-center">
                      <p>Upload Profile Pic</p>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={isSavingPicture}
              >
                {isSavingPicture ? "Saving..." : "Save Profile Picture"}
              </button>
            </form>

            {/* Profile Data Update Form */}
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {formData.password && (
                  <p className={`text-sm mt-2 ${passwordStrength === "Strong" ? "text-green-500" : passwordStrength === "Medium" ? "text-yellow-500" : "text-red-500"}`}>
                    Password strength: {passwordStrength}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleProfileChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Notification */}
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  );
}

export default UpdateProfileModal;
