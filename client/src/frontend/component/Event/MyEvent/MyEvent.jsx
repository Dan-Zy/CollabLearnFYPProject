import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import EventItem from './EventItem';

function MyEvent({ onGoBack }) {
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedView = localStorage.getItem('myEventView');
    if (savedView === 'myEvents') {
      setUserId(localStorage.getItem('userId'));
      fetchEvents();
    } else {
      decodeToken();
      fetchEvents();
    }
  }, []);

  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const decodedToken = jwt_decode(token);
    setUserId(decodedToken.id);
    localStorage.setItem('userId', decodedToken.id);
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await axios.get('http://localhost:3001/collablearn/getEvents', {
        headers: {
          Authorization: `${token}`
        }
      });

      setEvents(response.data.events);
      localStorage.setItem('myEventView', 'myEvents');
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleBackClick = () => {
    const suggestions = ['Check your scheduled events', 'Explore new event categories'];
    onGoBack(suggestions);
  };

  const filteredEvents = events.filter(event => event.hostId._id === userId);

  return (
    <div className="flex flex-col justify-center items-center mr-5 ml-5">
      <div className="flex items-center justify-start w-full ">
        <button onClick={handleBackClick}>
          <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-500 text-xl hover:text-indigo-600" />
        </button>
      </div>
      <div className="flex-1 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event, index) => (
          <EventItem key={index} {...event} />
        ))}
      </div>
    </div>
  );
}

export default MyEvent;
