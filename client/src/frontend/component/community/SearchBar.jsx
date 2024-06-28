import React from 'react';
import CreateCommunity from './CreateCommunity/CreateCommunity';

export function SearchBar({ searchQuery, setSearchQuery }) {

   
    return (
    <div className="flex justify-between w-full py-2">
      <input
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-center shadow"
        type="text"
        placeholder="Search community"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="ml-4">
            <CreateCommunity/>
      </div>
    </div>
  );
}
