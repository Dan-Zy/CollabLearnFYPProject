import React, { useState } from 'react';

function EventItem({ eventName, eventDescription, startDateTime, eventLink, eventGenre, imageBanner }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="relative flex justify-between items-center bg-white rounded-2xl p-4 my-2 shadow-md cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-gray-700 text-s flex-1"><span className="text-gray-900">Title:</span> {eventName}</div>
      <div className="text-gray-700 text-s flex-1"><span className="text-gray-900">Description:</span> {eventDescription}</div>
      <div className="text-gray-700 text-s flex-1"><span className="text-gray-900">Start:</span> {new Date(startDateTime).toLocaleString()}</div>

      {isHovered && (
        <div
          className="fixed text-left w-64 p-4 bg-white rounded-lg shadow-lg z-10"
          style={{ top: mousePosition.y +20, left: mousePosition.x - 32 }}
        >
          <img src={`http://localhost:3001/${imageBanner}`} alt="Event Banner" className="w-full h-32 object-cover rounded-lg mb-2" />
          <div className="text-gray-700 text-s"><span className="text-gray-900 ">Title:</span> {eventName}</div>
          <div className="text-gray-700 text-s"><span className="text-gray-900 ">Description:</span> {eventDescription}</div>
          <div className="text-gray-700 text-s"><span className="text-gray-900 ">Start:</span> {new Date(startDateTime).toLocaleString()}</div>
          <div className="text-gray-700 text-s"><span className="text-gray-900 ">Genre:</span> {eventGenre}</div>
        </div>
      )}
    </div>
  );
}

export default EventItem;
