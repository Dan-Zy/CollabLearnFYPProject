import React from 'react';

function Header() {
  return (
    <div className="header-component flex justify-between items-center w-4/5 mx-auto bg-gray-100 text-gray-800 font-sans p-4 rounded-lg shadow-md">
  <div className="group-info flex-1">
    <h1 className="group-title text-2xl">Computer Interaction</h1>
    <div className="group-title-info flex space-x-2 text-sm">
      <p className="group-status">Private group</p>  
      <p className="group-members">2.7k Members</p>
    </div>
  </div>
  <div className="header-buttons flex space-x-2">
    <button className="share-button bg-indigo-600 text-white px-4 py-2 rounded-full">Share</button>
    <button className="members-button bg-indigo-600 text-white px-4 py-2 rounded-full">Members ›</button>
  </div>
</div>

  );
}

export default Header;
