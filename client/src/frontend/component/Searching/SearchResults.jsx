import React, { useState } from 'react';
import { PostCall } from './Posts.jsx';
import { CommunityHome } from './Community.jsx';

const SearchResults = ({ query }) => {
  const [activeTab, setActiveTab] = useState('Posts');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h2>
      <nav className="mb-4">
        <ul className="flex border-b">
          {['Posts', 'People', 'Community', 'Events'].map((tab) => (
            <li key={tab} className={`mr-4 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}>
              <button
                onClick={() => handleTabChange(tab)}
                className={`py-2 px-4 ${activeTab === tab ? 'text-blue-500' : 'text-gray-500'}`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        {activeTab === 'Posts' && <div><PostCall query={query} /></div>}
        {activeTab === 'People' && <div>People results</div>}
        {activeTab === 'Community' && <div><CommunityHome query={query} /></div>}
        {activeTab === 'Events' && <div>Events results</div>}
      </div>
    </div>
  );
};

export default SearchResults;
