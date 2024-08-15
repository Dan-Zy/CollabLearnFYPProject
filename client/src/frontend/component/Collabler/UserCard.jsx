import React, { useState } from 'react';
import axios from 'axios';

function UserCard({ user, type, onAction }) {
  const [actionState, setActionState] = useState(null);

  const handleActionClick = async () => {
    let endpoint, method;
    
    switch (type) {
      case 'suggested':
        endpoint = actionState ? `/removeCollabRequest/${user._id}` : `/sendCollabRequest/${user._id}`;
        method = actionState ? 'put' : 'post';
        break;
      case 'received':
        endpoint = actionState === 'accepted' ? `/cancelCollabRequest/${user._id}` : `/acceptCollabRequest/${user._id}`;
        method = 'put';
        break;
      case 'collaborator':
        // Handle any specific logic for collaborators here if needed
        break;
      default:
        console.error('Unknown type:', type);
        return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios({
        method: method,
        url: `http://localhost:3001/collablearn${endpoint}`,
        headers: {
          Authorization: `${token}`,
        },
      });
      setActionState(!actionState);
    } catch (error) {
      console.error(`Error handling action for type ${type}:`, error);
    }
  };

  const renderButton = () => {
    switch (type) {
      case 'suggested':
        return (
          <button 
            className={`bg-indigo-500 text-white px-4 py-1 rounded-full mt-2 ${actionState ? 'bg-indigo-300' : ''}`} 
            onClick={handleActionClick}
          >
            {actionState ? 'Undo' : 'Send Request'}
          </button>
        );
      case 'received':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => { setActionState('accepted'); handleActionClick(); }}
              className="bg-indigo-500 text-white px-4 py-1 rounded-full"
            >
              Accept
            </button>
            <button
              onClick={() => { setActionState('declined'); handleActionClick(); }}
              className="bg-red-500 text-white px-4 py-1 rounded-full"
            >
              Decline
            </button>
          </div>
        );
      case 'collaborator':
        return (
          <button 
            className="bg-indigo-500 text-white px-4 py-1 rounded-full mt-2"
            onClick={() => alert('Page not developed')}
          >
            View Profile
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-4 mr-4 mb-4 shadow-lg w-full md:w-1/3 lg:w-1/4">
      <img 
        src={`http://localhost:3001/${user.profilePicture}`} 
        alt={`${user.username}`} 
        className="w-16 h-16 rounded-full mb-2 cursor-pointer" 
      />
      <div className="flex-grow text-center">
        <h3 className="font-bold">{user.username}</h3>
        <p>{user.role}</p>
      </div>
      {renderButton()}
    </div>
  );
}

export default UserCard;
