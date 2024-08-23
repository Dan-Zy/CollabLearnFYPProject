import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CommunityCard } from '../community/CommunityCard';
import CommunityViewHome from '../community/CommunityView/CommunityViewHome';
import jwt_decode from 'jwt-decode';
import Notification from '../SystemNotification'; 

export function CommunityHome({ query }) {
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'joined');
  const [searchQuery, setSearchQuery] = useState(query || localStorage.getItem('searchQuery') || '');
  const [view, setView] = useState('CommunityHome');
  const [communityId, setCommunityId] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [userId, setUserId] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" }); // Add notification state

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

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

  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };

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
        console.error("Error fetching communities", error);
        setNotification({ message: "Error loading communities", type: "error" });
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    const filtered = communities.filter(
      (community) =>
        community.communityName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommunities(filtered);
  }, [communities, searchQuery]);

  const renderContent = () => {
    if (searchQuery === '') {
      return <div className="text-center text-gray-500">Search something...</div>;
    }

    if (filteredCommunities.length === 0) {
      return <div className="text-center text-gray-500">No communities found</div>;
    }

    return (
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
            query={searchQuery}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      {view === 'CommunityHome' ? (
        <div className="mt-4">
          {renderContent()}
        </div>
      ) : (
        <CommunityViewHome communityId={communityId} />
      )}
    </div>
  );
}

export default CommunityHome;
