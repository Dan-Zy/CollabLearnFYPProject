import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './NavBar';
import { SearchBar } from './SearchBar';
import { GenreSelector } from './GenerSelector';
import { CommunityCard } from './CommunityCard';
import CommunityViewHome from './CommunityView/CommunityViewHome';
import jwt_decode from 'jwt-decode';

export function CommunityHome() {
  const [activeTab, setActiveTab] = useState('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [communities, setCommunities] = useState([]);
  const [userId, setUserId] = useState('');
  const [view, setView] = useState('CommunityHome');
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  useEffect(() => {
    const fetchUserId = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.id);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/collablearn/getCommunities', {
          headers: {
            'Authorization': `${token}`
          }
        });
        setCommunities(response.data.communities);
      } catch (error) {
        console.error("Error fetching communities", error);
      }
    };

    fetchCommunities();
  }, []);

  const handleRemoveCommunity = (communityId) => {
    setCommunities((prevCommunities) => prevCommunities.filter((community) => community._id !== communityId));
  };

  const handleChangeView = (newView, communityId) => {
    setView(newView);
    setSelectedCommunityId(communityId);
  };

  const filteredCommunities = communities.filter((community) => {
    const isMember = community.members.includes(userId);
    return (
      community.communityName &&
      community.communityName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGenre === '' || community.communityGenre === selectedGenre) &&
      ((activeTab === 'joined' && isMember) || (activeTab === 'suggested' && !isMember))
    );
  });

  return (
    <div className="container mx-auto p-4">
      {view === 'CommunityHome' ? (
        <>
          <div className="flex flex-col items-center">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <GenreSelector selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community._id}
                  id={community._id}
                  img={community.communityBanner}
                  title={community.communityName}
                  description={community.communityDescription}
                  postCount={community.postCount || 'N/A'}
                  memberCount={community.members.length}
                  rating={community.rating || 'N/A'}
                  activeTab={activeTab}
                  onRemoveCommunity={handleRemoveCommunity}
                  onChangeView={handleChangeView} // Pass the handler to the CommunityCard
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <CommunityViewHome communityId={selectedCommunityId} />
      )}
    </div>
  );
}
