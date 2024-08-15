import React, { useState } from 'react';

function CollaboratorItem({ collaborator, onClick }) {
  const [interested, setInterested] = useState(false);
  console.log('====================================');
  console.log(collaborator);
  console.log('====================================');
  const toggleInterested = () => {
    setInterested(!interested);
  };

  return (
    <div className="flex items-center bg-white rounded-lg p-4 mb-4 shadow-sm">
      <img 
        src={`http://localhost:3001/${collaborator.profilePicture}`} 
        alt={`${collaborator.username}`} 
        onClick={onClick} 
        className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full mr-4 cursor-pointer" 
      />
      <div className="flex-grow cursor-pointer" onClick={onClick}>
        <h3 className="font-bold">{collaborator.username}</h3>
        <p>{collaborator.role}</p>
      </div>
      <button 
        className={`bg-gray-600 text-white flex justify-center items-center px-4 py-2 rounded ${interested ? 'bg-indigo-500' : ''}`} 
        onClick={toggleInterested}
      >
        {interested ? 'Send Collab' : 'Remove'}
      </button>
    </div>
  );
}

export default CollaboratorItem;
