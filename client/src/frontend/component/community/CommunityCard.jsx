import React, { useState } from 'react';
import axios from 'axios';

export function CommunityCard({ id, img, title, description, postCount, memberCount, rating, activeTab, onRemoveCommunity, onChangeView }) {
  const handleJoinClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3001/collablearn/addMember/${id}`, {}, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(response.data.message);
      onRemoveCommunity(id); // Call the handler to remove the community from the suggested list
    } catch (error) {
      console.error("Error adding member to community", error);
      alert("Failed to join the community");
    }
  };

  const handleViewClick = () => {
    onChangeView('CommunityViewHome', id); // Call the handler to change the view state
  };

  return (
    <div className="community-item border p-4 rounded-lg shadow-lg bg-white text-center overflow-hidden">
      <div className="relative">
        <img
          src={img ? `http://localhost:3001/${img}` : 'https://via.placeholder.com/40'}
          alt="Profile"
          className="w-full h-[30vh] object-cover"
        />
      </div>
      <div className="pt-10">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="community-description text-gray-600 mt-2">{description}</p>
        <div className="profile-stats mt-4 flex justify-around">
          <div className="stats-item">
            <p>Posts</p>
            <span>{postCount}</span>
          </div>
          <div className="stats-item">
            <p>Followers</p>
            <span>{memberCount}</span>
          </div>
        </div>
        {activeTab === 'suggested' ? (
          <button
            onClick={handleJoinClick}
            className="view-button bg-gray-400 text-white rounded-lg px-4 py-2 mt-4"
          >
            Ask to Join
          </button>
        ) : (
          <button onClick={handleViewClick} className="view-button bg-indigo-500 text-white rounded-lg px-4 py-2 mt-4">
            View
          </button>
        )}
      </div>
    </div>
  );
}
