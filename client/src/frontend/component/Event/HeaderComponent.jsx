import React from 'react';

function HeaderComponent() {
  return (
    <header className="flex items-center  mb-5 w-100 border-b border-indigo-300 p-4">
      <a className="text-xl flex-1 text-start justify-start text-indigo-500" href="/MyEvent">My Events</a>
      <a className='flex justify-end' href="/CreateEvent">
        <button className="text-l m-1 h-10 text-white bg-indigo-500 rounded">
          Create Event ✚
        </button>
      </a>
    </header>
  );
}

export default HeaderComponent;
