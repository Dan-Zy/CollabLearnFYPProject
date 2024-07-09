import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoverPhoto from './CoverPhoto';
import Header from './Header';
import NavBar from './NavBar';
import Feed from './Feed';
function CommunityViewHome({ communityId }) {
  const [community, setCommunity] = useState(null);
  const [view , setView] = useState('Feed')
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/collablearn/getCommunity/${communityId}`,
          {
            headers:{
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
    <div className="flex flex-col items-center">
      <CoverPhoto imgSrc={community.communityBanner} />
      <Header name={community.communityName} status={community.privacy} memberCount={community.members.length} />
      <NavBar name="/CommunityHome" />
      {view === 'Feed' &&(
        <Feed communityId={communityId}/>
      )}
    </div>
  );
}

export default CommunityViewHome;
