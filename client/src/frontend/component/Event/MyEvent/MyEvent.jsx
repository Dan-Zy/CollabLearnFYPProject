import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import EventItem from './EventItem';
import HeaderComponent from '../HeaderComponent';

function MyEvent({ onCreateEvent, onViewEvents }) {
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const decodeToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.id);
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
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    decodeToken();
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => event.hostId._id === userId);

  return (
    <div className="flex justify-center items-center mr-5 ml-5">
      <div className="flex-1 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event, index) => (
          <EventItem key={index} {...event} />
        ))}
      </div>
    </div>
  );
}

export default MyEvent;
