// EventItem.jsx
import React from 'react';

function EventItem({ title, duration, start }) {
  return (
    <div className="flex  justify-between items-center bg-white rounded-2xl p-4 my-2 shadow-md cursor-pointer">
      <div className="text-gray-700 text-lg flex-1"><span className="text-gray-900">Title:</span> {title}</div>
      <div className="text-gray-700 text-lg flex-1"><span className="text-gray-900">Duration:</span> {duration}</div>
      <div className="text-gray-700 text-lg flex-1"><span className="text-gray-900">Start:</span> {start}</div>
    </div>
  );
}

export default EventItem;
