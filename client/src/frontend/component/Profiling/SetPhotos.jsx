import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../../assets/MainLogo_White.png';

export default function SetPhotos() {
  const location = useLocation();
  const { userInfo, role, form } = location.state;
  const [profilePic, setProfilePic] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const displayFormData = () => (
    <div className='flex  flex-col text-left'>
      
      <p>Name: {userInfo.name}</p>
      <p>Email: {userInfo.email}</p>
      <h3>Role: {role}</h3>
      {Object.entries(form).map(([key, value]) => (
        Array.isArray(value) ? value.map((item, index) => <p key={index}>{`${key} ${index + 1}: ${item}`}</p>) : <p key={key}>{`${key}: ${value}`}</p>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="flex flex-1 flex-col items-center bg-indigo-600 p-2">
        <div>
          <img src={logo} alt="Logo" className="w-1/2 lg:w-1/4" />
        </div>
        <div className="flex flex-1 flex-col justify-center items-center text-center text-white">
          <h2 className="text-5xl font-bold">Be a Collabler</h2>
          <p className="mt-4 text-l">Your Information here</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center p-8 bg-white relative">
        <div className="relative w-full h-48 ">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoChange}
            className="absolute opacity-0 cursor-pointer w-full h-48"
            style={{ top: 0, left: 0 }}
          />
          {coverPhoto ? (
            <img src={coverPhoto} alt="Cover" className="object-cover w-full h-full" />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <p>Upload Cover Photo</p>
            </div>
          )}
        </div>
        <div className="absolute top-40 lg:top-40 transform -translate-x-1/2 left-1/2">
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="absolute opacity-0 cursor-pointer w-24 h-24 rounded-full"
            style={{ top: 0, left: 0 }}
          />
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white" />
          ) : (
            <div className="bg-gray-200 w-24 h-24 rounded-full border-4 border-white flex items-center justify-center">
              <p>Upload Profile Pic</p>
            </div>
          )}
        </div>
        
        <div className="mt-10 overflow-y-auto scroll max-h-screen no-scrollbar">
        <h3 className='text-indigo-400 font-bold text-2xl border-indigo-300 border-b-2 '> User Info</h3>
          {displayFormData()}
        </div>
      </div>
    </div>
  );
}
