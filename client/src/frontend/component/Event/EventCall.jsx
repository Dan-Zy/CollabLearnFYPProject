import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import EventCardComponent from './EventCard';
import CreateEvent from './CreateEvent/CreateEvent';
import MyEvent from './MyEvent/MyEvent';
import axios from 'axios';
import LiveEventCard from './LiveEventCard';

function EventCall() {
  const [view, setView] = useState('scheduledEvents');
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);

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

        setScheduledEvents(response.data.events.filter(event => event.type === 'Scheduled'));
        setOngoingEvents(response.data.events.filter(event => event.type === 'Instant'));
      
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

  const handleViewScheduledEventsClick = () => {
    setView('scheduledEvents');
  };

  const handleViewOngoingEventsClick = () => {
    setView('ongoingEvents');
  };

  return (
    <div className="flex flex-col">
      <HeaderComponent
        onCreateEvent={handleCreateEventClick}
        onViewEvents={handleViewEventsClick}
      />
      {view !== 'createEvent' && view !== 'myEvents' && (
        <nav>
          <text className='m-2 hover:text-indigo-500 cursor-pointer' onClick={handleViewScheduledEventsClick}>Scheduled Events</text>
          <text className='m-2 hover:text-indigo-500 cursor-pointer' onClick={handleViewOngoingEventsClick}>Ongoing Events</text>
        </nav>
      )}
      {view === 'scheduledEvents' && (
        <section className="flex flex-col">
          {scheduledEvents.map((event, index) => (
            <EventCardComponent key={index} {...event} />
          ))}
        </section>
      )}
      {view === 'ongoingEvents' && (
        <section className="flex flex-col">
          {ongoingEvents.map((event, index) => (
            <LiveEventCard key={index} {...event} />
          ))}
        </section>
      )}
      {view === 'createEvent' && <CreateEvent />}
      {view === 'myEvents' && <MyEvent />}
    </div>
  );
}

export default EventCall;
