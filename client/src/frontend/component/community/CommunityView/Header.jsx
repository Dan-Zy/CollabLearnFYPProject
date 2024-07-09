import React from 'react';

function Header({ name, status, memberCount }) {
  console.log('====================================');
  console.log(status,memberCount);
  console.log('====================================');
  return (
    <div className="header-component flex w-full mx-auto bg-gray-100 text-gray-800 font-sans p-4 rounded-lg shadow-md">
      <div className="group-info flex-1 flex-col justify-start">
        <h1 className="flex text-2xl">{name}</h1>
        <div className="group-title-info flex space-x-2 text-sm">
          <p className="group-status">{status} group</p>  
          <p className="group-members">{memberCount} Members</p>
        </div>
      </div>
      <div className="header-buttons flex space-x-2">
        <button className="share-button bg-indigo-500 text-white px-2 h-9 rounded-xl hover:bg-indigo-600">Share</button>
        <button className="members-button bg-indigo-500 text-white px-2 h-9 rounded-xl hover:bg-indigo-600 ">Members ›</button>
      </div>
    </div>
  );
}

export default Header;
