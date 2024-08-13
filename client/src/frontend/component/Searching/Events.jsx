import React, { useEffect, useState } from 'react';
import EventCardComponent from '../Event/EventCard';
import axios from 'axios';
import LiveEventCard from '../Event/LiveEventCard';

function EventCall({ query }) {
  const [view, setView] = useState('scheduledEvents');
  const [flash, setFlash] = useState(false);
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

        setScheduledEvents(response.data.events.filter(event => event.eventStatus === 'Upcoming'));
        setOngoingEvents(response.data.events.filter(event => event.eventStatus === 'Ongoing'));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const filteredScheduledEvents = scheduledEvents.filter(event =>
    event.eventName.toLowerCase().includes(query.toLowerCase()) ||
    event.eventDescription.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOngoingEvents = ongoingEvents.filter(event =>
    event.eventName.toLowerCase().includes(query.toLowerCase()) ||
    event.eventDescription.toLowerCase().includes(query.toLowerCase())
  );

  const renderEvents = () => {
    if (query === '') {
      return <div className="text-center text-gray-500">Search something...</div>;
    }

    if (filteredOngoingEvents.length > 0) {
      return filteredOngoingEvents.map((event, index) => <LiveEventCard key={index} {...event} />);
    } else if (filteredScheduledEvents.length > 0) {
      return filteredScheduledEvents.map((event, index) => <EventCardComponent key={index} {...event} />);
    } else {
      return <div className="text-center text-gray-500">No events found</div>;
    }
  };

  return (
    <div className={`flex flex-col ${flash ? 'animate-flash' : ''}`}>
      {view !== 'createEvent' && view !== 'myEvents' && (
        <section className="flex flex-col">
          {renderEvents()}
        </section>
      )}
    </div>
  );
}

export default EventCall;
