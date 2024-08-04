import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './NavBar';
import { SearchBar } from './SearchBar';
import { GenreSelector } from './GenerSelector';
import { CommunityCard } from './CommunityCard';
import CommunityViewHome from './CommunityView/CommunityViewHome';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function CommunityHome() {
  const [activeTab, setActiveTab] = useState('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [communities, setCommunities] = useState([]);
  const [userId, setUserId] = useState('');
  const [view, setView] = useState('CommunityHome');
  const [communityId, setCommunityId] = useState(null);
  const [flash, setFlash] = useState(false);

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

    toast.promise(fetchCommunities(), {
      pending: 'Loading communities...',
      success: 'Communities loaded successfully!',
      error: 'Error loading communities'
    });
  }, []);

  const handleRemoveCommunity = (communityId) => {
    setCommunities((prevCommunities) => prevCommunities.filter((community) => community._id !== communityId));
  };

  const handleChangeView = (newView, communityId) => {
    setView(newView);
    setCommunityId(communityId);
  };

  const triggerFlashEffect = (callback) => {
    setFlash(true);
    setTimeout(() => {
      callback();
      setFlash(false);
    }, 500);
  };


  const handleGenreChange = (genre) => {
    triggerFlashEffect(() => setSelectedGenre(genre));
  };

  const handleTabChange = (tab) => {
    triggerFlashEffect(() => setActiveTab(tab));
    setSelectedGenre('');
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
    <div className={`container mx-auto p-4 ${flash ? 'animate-flash' : ''}`}>
      <ToastContainer />
      {view === 'CommunityHome' ? (
        <>
          <div className="flex flex-col items-center">
            <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
         <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <GenreSelector selectedGenre={selectedGenre} setSelectedGenre={handleGenreChange} />
          <div className="mt-4">
            {filteredCommunities.length === 0 ? (
              <div className="text-center text-gray-500">No communities yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCommunities.map((community) => (
                  <CommunityCard
                    key={community._id}
                    id={community._id}
                    img={community.communityBanner}
                    title={community.communityName}
                    description={community.communityDescription}
                    // postCount={community.postCount || 'N/A'}
                    memberCount={community.members.length}
                    rating={community.rating || 'N/A'}
                    activeTab={activeTab}
                    onRemoveCommunity={handleRemoveCommunity}
                    onChangeView={handleChangeView}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <CommunityViewHome communityId={communityId} />
      )}
    </div>
  );
}
