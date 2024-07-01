import React from 'react';
import { Link } from 'react-router-dom';

export function CommunityCard({ id, img, title, description, postCount, memberCount, rating, activeTab }) {
  return (
    <div className="community-item border p-4 rounded-lg shadow-lg bg-white text-center overflow-hidden">
      <div className="relative">
        <img src={img} alt="cover" className="w-full h-24 object-cover" />
      </div>
      <div className="pt-10">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="community-description text-gray-600 mt-2">{description}</p>
        <div className="profile-stats mt-4 flex justify-around">
          <div className="stats-item">
            <span>{postCount}</span>
            <p>Posts</p>
          </div>
          <div className="stats-item">
            <span>{memberCount}</span>
            <p>Followers</p>
          </div>
          <div className="stats-item">
            <span>{rating}</span>
            <p>Following</p>
          </div>
        </div>
          <button className={`view-button bg-gray-400 text-white rounded-lg px-4 py-2 mt-4 ${activeTab === 'suggested' ? 'bg-gray-400' : 'bg-indigo-500'}`}>
            {activeTab === 'suggested' ? 'Ask to Join' : 'View'}
          </button>

      </div>
    </div>
  );
}
