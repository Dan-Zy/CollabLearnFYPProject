import React from 'react';

export function CommunityCard({ id, img, title, description, postCount, memberCount, rating, activeTab }) {
  return (
    <div className="community-item border p-4 rounded-lg shadow-lg" id={id} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', textAlign: 'center' }}>
      <div className="community-header" style={{ position: 'relative' }}>
        <img src={img} alt="cover" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
      </div>
      <div className="community-body" style={{ paddingTop: '40px' }}>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="community-description text-gray-600 mt-2">{description}</p>
        <div className="profile-stats mt-4" style={{ display: 'flex', justifyContent: 'space-around' }}>
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
        <a href="/CommunityHome">
          <button className={`view-button bg-gray-400 text-white rounded-lg px-4 py-2 mt-4 ${activeTab === 'suggested' ? 'ask-to-join' : 'bg-indigo-500'}`}>
            {activeTab === 'suggested' ? 'Ask to Join' : 'View'}
          </button>
        </a>
      </div>
    </div>
  );
}
