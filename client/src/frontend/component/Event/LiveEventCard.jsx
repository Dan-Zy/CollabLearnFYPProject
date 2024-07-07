import React, { useState } from 'react';

function LiveEventCard({ eventName, title, hostId }) {
  const [interested, setInterested] = useState(false);
  const showJoinButton = true;
  const participants = [
    { image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { image: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { image: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { image: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { image: 'https://randomuser.me/api/portraits/women/6.jpg' },
    { image: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { image: 'https://randomuser.me/api/portraits/women/8.jpg' },
    { image: 'https://randomuser.me/api/portraits/men/9.jpg' },
    { image: 'https://randomuser.me/api/portraits/women/10.jpg' },
    { image: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { image: 'https://randomuser.me/api/portraits/women/12.jpg' },
    { image: 'https://randomuser.me/api/portraits/men/13.jpg' },
    { image: 'https://randomuser.me/api/portraits/women/14.jpg' },
    { image: 'https://randomuser.me/api/portraits/men/13.jpg' },
    { image: 'https://randomuser.me/api/portraits/women/14.jpg' },
  ];
  const toggleInterested = () => {
    setInterested(!interested);
  };

  return (
    <div className="flex flex-col m-4 items-center justify-center bg-white shadow-lg rounded-lg">
      <div className="flex w-[80%] flex-row pt-4 ">
        <img
          src={hostId?.profilePicture
            ? `http://localhost:3001/${hostId?.profilePicture}`
            : "https://via.placeholder.com/40"
          }
          alt="Profile"
          className="rounded-full w-10 h-10 mr-3"
        />

        <div>
          <p className="text-sm flex text-gray-500">Created by</p>
          <h4 className="font-semibold">{hostId?.username || 'Unknown Host'}</h4>
        </div>
      </div>
      <div className="flex w-[80%] flex-row p-4">
        <h2 className="flex-1 text-lg font-bold text-start">{title}</h2>
      </div>
      <div className="grid grid-cols-6 gap-1 p-2 w-[80%] opacity-60">
        {participants.slice(0, 11).map((participant, index) => (
          <img
            key={index}
            src={participant.image}
            alt={`Participant ${index + 1}`}
            className="w-full h-full object-cover rounded"
          />
        ))}
        {participants.length > 12 && (
          <div className="flex items-center justify-center bg-gray-200 rounded">
            <span className="text-sm text-gray-700">+{participants.length - 12}</span>
          </div>
        )}
      </div>
      <div className="pl-4 text-center w-[85%]">
        <div className="flex w-[100%] flex-row p-4">
          <h2 className="flex-1 text-lg font-bold text-start">{eventName}</h2>
          <span className="inline-block bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
            {participants.length} joined
          </span>
        </div>
        
      </div>
      {showJoinButton && (
          <button className="w-[85%] py-2 px-4 m-4 text-white rounded bg-indigo-400 hover:bg-indigo-500">
            Join
          </button>
        )}
    </div>
  );
}

export default LiveEventCard;
