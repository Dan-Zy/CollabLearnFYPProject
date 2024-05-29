import React, { useState } from 'react';
import img from '../../../assets/OIP (4).jfif';
import img2 from '../../../assets/OIP (3).jfif';
import img3 from '../../../assets/OIF.jfif';

function CollaboratorItem({ name, role, img, onClick }) {
  const [interested, setInterested] = useState(false);

  const toggleInterested = () => {
    setInterested(!interested);
  };

  return (
    <div className="flex items-center bg-white rounded-lg p-4 mb-4 shadow-sm">
      <img 
        src={img} 
        alt={`${name}`} 
        onClick={onClick} 
        className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full mr-4 cursor-pointer" 
      />
      <div className="flex-grow cursor-pointer" onClick={onClick}>
        <h3 className="font-bold">{name}</h3>
        <p>{role}</p>
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

function CollaboratorList() {
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);

  const collaborators = [
    { name: 'Talha', role: 'Student', img: img },
    { name: 'Ehtsham', role: 'Student', img: img2 },
    { name: 'Daniyal', role: 'Student', img: img3 },
    // Add more collaborators as needed
  ];

  const handleCollaboratorClick = (collaborator) => {
    setSelectedCollaborator(collaborator);
  };

  if (selectedCollaborator) {
    alert('Page not developed');
    // return <ProComp {...selectedCollaborator} />;
  }

  return (
    <div className="m-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-indigo-600">My Collaborator</h2>
        <a href="/see-all" className="text-black">See all</a>
      </div>
      {collaborators.map((collab, index) => (
        <CollaboratorItem key={index} {...collab} onClick={() => handleCollaboratorClick(collab)} />
      ))}
    </div>
  );
}

export default CollaboratorList;
