import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoverPhoto from './CoverPhoto';
import Header from './Header';
import NavBar from './NavBar';
import About from './About';
import DesicionForum from './DesicionForum/DesicionForum';
import Feed from './Feed';
import CommunityEvents from './Event/event';
import jwt_decode from 'jwt-decode';

function CommunityViewHome({ communityId, onLeaveCommunity, onDeleteCommunity, onBack }) {
  const [community, setCommunity] = useState(null);
  const [view, setView] = useState('Feed');
  const [activeLink, setActiveLink] = useState('Feed');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/collablearn/getCommunity/${communityId}`, {
          headers: {
            'Authorization': `${token}`
          }
        });
        setCommunity(response.data.community);
        const decodedToken = jwt_decode(token);
        setIsAdmin(response.data.community.adminId._id === decodedToken.id);
        
      } catch (error) {
        console.error('Error fetching community', error);
      }
    };

    fetchCommunity();
  }, [communityId]);

  if (!community) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col items-center">
      
      <button 
        onClick={onBack} 
        className="self-start mt-1 mb-1 ml-1 bg-indigo-200 text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Communities
      </button>
      
      <CoverPhoto imgSrc={community.communityBanner} />
      <Header 
        name={community.communityName} 
        status={community.privacy} 
        memberCount={community.members.length} 
        isAdmin={isAdmin}
        onLeaveCommunity={() => onLeaveCommunity(communityId)}
        onDeleteCommunity={() => onDeleteCommunity(communityId)}
      />
      <NavBar 
        activeLink={activeLink} 
        setActiveLink={setActiveLink} 
        setView={setView} 
      />
      {view === 'Feed' && <Feed communityId={communityId} />}
      {view === 'CommunityDF' && <DesicionForum communityId={communityId} />}
      {view === 'About' && <About communityId={communityId} />}
      {view === 'CommunityEvent' && <CommunityEvents communityId={communityId} />}
    </div>
  );
}

export default CommunityViewHome;
