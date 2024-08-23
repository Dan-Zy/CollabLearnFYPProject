import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './NavBar';
import { SearchBar } from './SearchBar';
import { GenreSelector } from './GenerSelector';
import { CommunityCard } from './CommunityCard';
import CommunityViewHome from './CommunityView/CommunityViewHome';
import jwt_decode from 'jwt-decode';
import Notification from '../SystemNotification'; // Import Notification

export function CommunityHome() {
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'joined');
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [selectedGenre, setSelectedGenre] = useState(localStorage.getItem('selectedGenre') || '');
  const [communities, setCommunities] = useState([]);
  const [userId, setUserId] = useState('');
  const [view, setView] = useState('CommunityHome');
  const [communityId, setCommunityId] = useState(null);
  const [flash, setFlash] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

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
        setNotification({ message: "Communities loaded successfully!", type: "success" });
      } catch (error) {
        console.error('Error fetching communities', error);
        setNotification({ message: "Error fetching communities", type: "error" });
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('selectedGenre', selectedGenre);
  }, [selectedGenre]);

  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };

  const handleRemoveCommunity = (communityId) => {
    setCommunities((prevCommunities) => prevCommunities.filter((community) => community._id !== communityId));
    setActiveTab('joined');
  };

  const handleChangeView = (newView, communityId) => {
    setView(newView);
    setCommunityId(communityId);
  };

  const handleBack = () => {
    setView('CommunityHome');
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

  const handleLeaveCommunity = async (communityId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:3001/collablearn/leaveCommunity/${communityId}`, {}, {
        headers: {
          'Authorization': `${token}`
        }
      });
      handleRemoveCommunity(communityId);
      setView('CommunityHome');
      setNotification({ message: "You have successfully left the community.", type: "success" });
    } catch (error) {
      console.error('Error leaving community', error);
      setNotification({ message: "Failed to leave the community.", type: "error" });
    }
  };

  const handleDeleteCommunity = async (communityId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/collablearn/deleteCommunity/${communityId}`, {
        headers: {
          'Authorization': `${token}`
        }
      });
      handleRemoveCommunity(communityId);
      setView('CommunityHome');
      setNotification({ message: "Community has been deleted.", type: "success" });
    } catch (error) {
      console.error('Error deleting community', error);
      setNotification({ message: "Failed to delete the community.", type: "error" });
    }
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
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
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
        <CommunityViewHome 
          communityId={communityId}
          onLeaveCommunity={handleLeaveCommunity}
          onDeleteCommunity={handleDeleteCommunity}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default CommunityHome;
