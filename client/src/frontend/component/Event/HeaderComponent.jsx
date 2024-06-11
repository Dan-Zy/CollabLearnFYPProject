import React from 'react';

function HeaderComponent({ onCreateEvent, onViewEvents }) {
  return (
    <header className="flex items-center mb-5 w-full border-b border-indigo-300 p-4">
      <span
        className="text-xl flex-1 text-start justify-start text-indigo-500 cursor-pointer"
        onClick={onViewEvents}
      >
        My Events
      </span>
      <button className="flex justify-end" onClick={onCreateEvent}>
        <p className="flex text-l items-center text-center h-10 text-indigo-500">
          Create Event
          <span className="text-l m-1 pl-0.5 pr-0.5 text-white bg-indigo-500 rounded-full">
            ✚
          </span>
        </p>
      </button>
    </header>
  );
}

export default HeaderComponent;
