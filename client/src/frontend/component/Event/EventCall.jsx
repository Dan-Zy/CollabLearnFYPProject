import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import EventCardComponent from './EventCard';
import CreateEvent from './CreateEvent/CreateEvent';
import MyEvent from './MyEvent/MyEvent';
import axios from 'axios';
import LiveEventCard from './LiveEventCard';
import GenreSelector from './GenerSelector';
function EventCall() {
  const [view, setView] = useState('scheduledEvents');
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredScheduledEvents = scheduledEvents.filter(event => {
    return (
      (selectedGenre === '' || event.genre === selectedGenre) &&
      (searchQuery === '' || event.eventName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredOngoingEvents = ongoingEvents.filter(event => {
    return (
      (selectedGenre === '' || event.genre === selectedGenre) &&
      (searchQuery === '' || event.eventName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="flex flex-col">
      <HeaderComponent
        onCreateEvent={handleCreateEventClick}
        onViewEvents={handleViewEventsClick}
      />
      {view !== 'createEvent' && view !== 'myEvents' && (
        <>
          <nav>
            <text className='m-2 hover:text-indigo-500 cursor-pointer' onClick={handleViewScheduledEventsClick}>Scheduled Events</text>
            <text className='m-2 hover:text-indigo-500 cursor-pointer' onClick={handleViewOngoingEventsClick}>Ongoing Events</text>
          </nav>
          <div className="flex justify-between w-full py-2">
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-center shadow"
              type="text"
              placeholder="Search event"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <GenreSelector selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
        </>
      )}
      {view === 'scheduledEvents' && (
        <section className="flex flex-col">
          {filteredScheduledEvents.map((event, index) => (
            <EventCardComponent key={index} {...event} />
          ))}
        </section>
      )}
      {view === 'ongoingEvents' && (
        <section className="flex flex-col">
          {filteredOngoingEvents.map((event, index) => (
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
