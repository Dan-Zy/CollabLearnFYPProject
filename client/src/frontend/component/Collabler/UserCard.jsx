import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserCard({ user, type, onUserClick }) {
  const [actionState, setActionState] = useState(type); // Set initial state based on type
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const [successMessage, setSuccessMessage] = useState(''); // State to manage success message
  const [errorMessage, setErrorMessage] = useState(''); // State to manage error message

  const handleActionClick = async (e, actionType = null) => {
    e.stopPropagation(); 
    setLoading(true); 
    setSuccessMessage(''); 
    setErrorMessage(''); 

    let endpoint, method;

    switch (actionState) {
      case 'suggested':
        endpoint = `/sendCollabRequest/${user._id}`;
        method = 'post';
        break;
      case 'undo':
        endpoint = `/removeCollabRequest/${user._id}`;
        method = 'put';
        break;
      case 'received':
        if (actionType === 'accepted') {
          endpoint = `/acceptCollabRequest/${user._id}`;
          method = 'put';
        } else if (actionType === 'declined') {
          endpoint = `/cancelCollabRequest/${user._id}`; 
          method = 'put';
        }
        break;
      case 'collaborator':
        endpoint = `/deleteCollabler/${user._id}`;
        method = 'put';
        break;
      default:
        console.error('Unknown type:', type);
        setLoading(false);
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

      // Update action state after successful request
      if (actionState === 'suggested') {
        setActionState('undo'); // Change state to 'undo' after sending request
      } else if (actionState === 'undo') {
        setActionState('suggested'); // Change state back to 'suggested' after undoing
      } else if (actionState === 'received') {
        setActionState(actionType === 'accepted' ? 'collaborator' : 'suggested');
      } else if (actionState === 'collaborator') {
        setActionState('suggested');
      }

      setSuccessMessage('Action successful!'); // Set success message
    } catch (error) {
      console.error(`Error handling action for type ${type}:`, error);
      setErrorMessage('Action failed. Please try again.'); // Set error message
      
      if (actionState === 'undo') {
        setActionState('undo'); // Keep it as 'undo' if undo action fails
      } else if (actionState === 'suggested') {
        setActionState('suggested'); // Keep it as 'suggested' if sending request fails
      }
    } finally {
      setLoading(false); 
    }
  };

  const renderButton = () => {
    switch (actionState) {
      case 'suggested':
        return (
          <button 
            className="bg-indigo-500 text-white px-4 py-1 rounded-full mt-2"
            onClick={handleActionClick} 
            disabled={loading} 
          >
            {loading ? 'Wait...' : 'Send Request'}
          </button>
        );
      case 'undo':
        return (
          <button 
            className="bg-indigo-300 text-white px-4 py-1 rounded-full mt-2"
            onClick={handleActionClick}  // Call the handler with the event
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Wait...' : 'Undo'}
          </button>
        );
      case 'received':
        return (
          <div className="flex space-x-2">
            <button
              onClick={(e) => { handleActionClick(e, 'accepted'); }}  // Call the handler with "accepted" action
              className="bg-indigo-500 text-white px-4 py-1 rounded-full"
              disabled={loading} 
            >
              {loading ? 'Wait...' : 'Accept'}
            </button>
            <button
              onClick={(e) => { handleActionClick(e, 'declined'); }}  // Call the handler with "declined" action
              className="bg-red-500 text-white px-4 py-1 rounded-full"
              disabled={loading} 
            >
              {loading ? 'Wait...' : 'Decline'}
            </button>
          </div>
        );
      case 'collaborator':
        return (
          <button 
            className="bg-indigo-500 text-white px-4 py-1 rounded-full mt-2"
            onClick={handleActionClick}  // Call the handler with the event
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Processing...' : 'Remove'}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col items-center bg-white rounded-lg p-4 mr-4 mb-4 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
      onClick={() => onUserClick(user._id, type)}  // Pass userId and type
    >
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
      {loading && <p className="text-sm text-gray-500 mt-2">Please wait...</p>}
      {successMessage && <p className="text-sm text-green-500 mt-2">{successMessage}</p>}
      {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}

export default UserCard;
