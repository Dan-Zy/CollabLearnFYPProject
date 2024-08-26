import React, { useState } from 'react';
import axios from 'axios';
import profilePic from '../../assets/faculty.png'; // Default image

export function RecommendUserCard({ profilePicture, username, role, userId }) {
  const [isRequested, setIsRequested] = useState(false); // State to track if request has been sent
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleSendRequest = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log(userId);
      
      await axios.post(
        `http://localhost:3001/collablearn/sendCollabRequest/${userId}`,
        {},{
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      
      

      setIsRequested(true); // Update state to indicate request was sent
    } catch (error) {
      console.error("Error sending collaboration request:", error);
      // Optionally, you can handle error state here
    } finally {
      setLoading(false);
    }
  };

  const handleUndoRequest = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/collablearn/removeCollabRequest/${userId}`,{},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setIsRequested(false); // Update state to indicate request was undone
    } catch (error) {
      console.error("Error undoing collaboration request:", error);
      // Optionally, you can handle error state here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[14vw] h-full p-5 shadow-xl max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={profilePicture || profilePic} // Use the imported image here
          alt={username}
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {username || "Unknown User"}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {role || "Unknown Role"}
        </span>
        <div className="flex mt-2 space-x-3 md:mt-2">
          <button
            onClick={isRequested ? handleUndoRequest : handleSendRequest} // Toggle between send and undo
            disabled={loading} // Disable button while loading
            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none ${
              isRequested ? "bg-indigo-200 hover:bg-indigo-300" : "bg-indigo-500 hover:bg-indigo-600"
            } ${loading && "cursor-not-allowed"}`} // Change style based on state
          >
            {loading ? 'Processing...' : isRequested ? 'Undo Request' : 'Send Collab Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommendUserCard;
