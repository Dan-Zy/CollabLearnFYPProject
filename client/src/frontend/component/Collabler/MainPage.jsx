import React, { useState } from 'react';
import CollaboratorList from './CollaboratorList';

function MainPageCollab() {
  const [activeTab, setActiveTab] = useState('MyCollaborator');

  const renderContent = () => {
    switch (activeTab) {
      case 'MyCollaborator':
        return <CollaboratorList />;
      case 'Requested':
        return <div>Requested Component Content</div>;
      case 'Suggested':
        return <div>Suggested Component Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="m-4">
      <div className="flex justify-around mb-4">
        <p 
          className={`px-4 py-2 ${activeTab === 'MyCollaborator' ? ' text-indigo-500 border-b-2 text-sm border-indigo-500' : 'text-xs'}`} 
          onClick={() => setActiveTab('MyCollaborator')}
        >
          My Collaborator
        </p>
        <p 
          className={`px-4 py-2 ${activeTab === 'Requested' ? ' text-indigo-500 border-b-2 text-sm border-indigo-500' : 'text-xs'}`} 
          onClick={() => setActiveTab('Requested')}
        >
          Requested
        </p>
        <p 
          className={`px-4 py-2 ${activeTab === 'Suggested' ? ' text-indigo-500 border-b-2 text-sm border-indigo-500' : 'text-xs'}`} 
          onClick={() => setActiveTab('Suggested')}
        >
          Suggested
        </p>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

export default MainPageCollab;
