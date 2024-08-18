import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoverPhoto from './CoverPhoto';
import Header from './Header';
import NavBar from './NavBar';
import About from './About';
import DesicionForum from './DesicionForum/DesicionForum';
import Feed from './Feed';
import CommunityEvents from './Event/event';
function CommunityViewHome({ communityId }) {
  const [community, setCommunity] = useState(null);
  const [view, setView] = useState('Feed');
  const [activeLink, setActiveLink] = useState('Feed');

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
      <CoverPhoto imgSrc={community.communityBanner} />
      <Header 
        name={community.communityName} 
        status={community.privacy} 
        memberCount={community.members.length} 
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
