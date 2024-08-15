import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OtherUserProfile({ userId }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('collablearn_token');
        const response = await axios.get(`http://localhost:3001/collablearn/user/getUser/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) return <div>Loading...</div>;

  const renderActionButton = () => {
    // Assuming userData contains the relevant relationship info
    if (userData.isCollaborator) {
      return (
        <button className="bg-red-500 text-white px-4 py-1 rounded-full mt-2">
          Remove Collaborator
        </button>
      );
    }
    if (userData.isRequested) {
      return (
        <button className="bg-indigo-500 text-white px-4 py-1 rounded-full mt-2">
          Cancel Request
        </button>
      );
    }
    if (userData.isSuggested) {
      return (
        <button className="bg-green-500 text-white px-4 py-1 rounded-full mt-2">
          Send Request
        </button>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <img 
        src={`http://localhost:3001/${userData.user.profilePicture}`} 
        alt={`${userData.user.username}`} 
        className="w-32 h-32 rounded-full mx-auto mb-4" 
      />
      <h2 className="text-center text-2xl font-bold">{userData.user.username}</h2>
      <p className="text-center text-gray-600">{userData.user.role}</p>
      <div className="mt-4 text-center">
        {renderActionButton()}
      </div>
    </div>
  );
}

export default OtherUserProfile;
