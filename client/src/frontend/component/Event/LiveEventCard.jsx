import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function LiveEventCard({ _id,eventName, title, hostId, numberOfParticipants, eventLink, eventId }) {
  const [interested, setInterested] = useState(false);
  const showJoinButton = true;

  const toggleInterested = () => {
    setInterested(!interested);
  };

  const handleJoinEvent = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:3001/collablearn/joinEvent/${_id}`,
        {},
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );

      if (response.status === 200) {
        // Optionally update the UI or participants list here
        toast.success('Successfully joined the event!');
        window.open(eventLink, '_blank');
      } else {
        toast.error('Failed to join the event.');
      }
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('An error occurred while trying to join the event.');
    }
  };

  return (
    <div className="flex flex-col m-4 items-center justify-center bg-white shadow-lg rounded-lg">
      <div className="flex w-[80%] flex-row pt-4">
        <img
          src={hostId?.profilePicture
            ? `http://localhost:3001/${hostId?.profilePicture}`
            : "https://via.placeholder.com/40"
          }
          alt="Profile"
          className="rounded-full w-10 h-10 mr-3"
        />
        <div>
          <p className="text-sm text-gray-500">Created by</p>
          <h4 className="font-semibold">{hostId?.username || 'Unknown Host'}</h4>
        </div>
      </div>
      <div className="flex w-[80%] flex-row p-4">
        <h2 className="flex-1 text-lg font-bold text-start">{title}</h2>
      </div>
      <div className="grid grid-cols-6 gap-1 p-2 w-[80%] opacity-60">
        {numberOfParticipants.length > 0 ? (
          numberOfParticipants.slice(0, 12).map((participant, index) => (
            <img
              key={index}
              src={`http://localhost:3001/${participant?.profilePicture}`}
              alt={`Participant ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No participants yet</div>
        )}
        {numberOfParticipants.length > 12 && (
          <div className="flex items-center justify-center bg-gray-200 rounded">
            <span className="text-sm text-gray-700">+{numberOfParticipants.length - 12}</span>
          </div>
        )}
      </div>
      <div className="pl-4 text-center w-[85%]">
        <div className="flex w-[100%] flex-row p-4">
          <h2 className="flex-1 text-lg font-bold text-start">{eventName}</h2>
          <span className="inline-block bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
            {numberOfParticipants.length} joined
          </span>
        </div>
      </div>
      {showJoinButton && (

<a href={eventLink} target="_blank" rel="noopener noreferrer" className="w-full">
      <button
          onClick={handleJoinEvent}
          className="w-[85%] py-2 px-4 m-4 text-white rounded bg-indigo-500 hover:bg-indigo-600"
        >
          Join
        </button>
        </a>
      )}
    </div>
  );
}

export default LiveEventCard;

          