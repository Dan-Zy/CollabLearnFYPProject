import React from 'react';


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

    </div>
  );
}
