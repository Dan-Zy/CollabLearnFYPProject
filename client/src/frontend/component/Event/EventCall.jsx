import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import EventCardComponent from './EventCard';
import CreateEvent from './CreateEvent/CreateEvent';
import MyEvent from './MyEvent/MyEvent';
import axios from 'axios';

function EventCall() {
  const [view, setView] = useState('events');
  const [events, setEvents] = useState([]);

  useEffect(() => {
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

        setEvents(response.data.events.filter(event => event.type === 'Scheduled'));
        console.log('====================================');
        console.log(response.data.events.filter(event => event.type === 'Scheduled'));
        console.log('====================================');
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEventClick = () => {
    setView('createEvent');
  };

  const handleViewEventsClick = () => {
    setView('myEvents');
  };

  return (
    <div className="flex flex-col">
      <HeaderComponent
        onCreateEvent={handleCreateEventClick}
        onViewEvents={handleViewEventsClick}
      />
      {view === 'events' && (
        <section className="flex flex-col">
          {events.map((event, index) => (
            <EventCardComponent key={index} {...event} />
          ))}
        </section>
      )}
      {view === 'createEvent' && <CreateEvent />}
      {view === 'myEvents' && <MyEvent />}
    </div>
  );
}

export default EventCall;
