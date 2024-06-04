import React, { useState } from 'react'; 

function EventCard({ title, img, time }) {
  const [interested, setInterested] = useState(false);
  const toggleInterested = () => {
    setInterested(!interested);
  };

  return (
    <div className="flex flex-col m-4 pt-4 items-center justify-center bg-white shadow-lg rounded-lg">
      <div className="flex w-[80%] items-center justify-center">
        <img className="w-full h-60 rounded-t-lg" src={img} alt="" />
      </div>
      <div className="flex w-[80%] flex-row p-4">
        <h2 className="flex-1 text-lg font-bold text-start">{title}</h2>
        <p className="text-gray-600 text-end">{time}</p>
      </div>
      <div className="flex w-[80%] flex-row p-4">
        <h2 className="flex-1 text-lg font-bold text-start">{title}</h2>
        <p className="text-gray-600 text-end">{time}</p>
      </div>
      <button 
        className={`w-[80%] py-2 px-4 m-4 text-white rounded ${interested ? 'bg-yellow-500' : 'bg-indigo-500'}`}
        onClick={toggleInterested}
      >
        {interested ? 'You are interested in this event' : 'Interested'}
      </button>
    </div>
  );
}

export default EventCard;
