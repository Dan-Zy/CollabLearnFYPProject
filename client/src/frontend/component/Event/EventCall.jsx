import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import EventCardComponent from './EventCard';
import CreateEvent from './CreateEvent/CreateEvent';
import MyEvent from './MyEvent/MyEvent';
import axios from 'axios';
import LiveEventCard from './LiveEventCard';
import GenreSelector from './GenerSelector';
import { SearchBar } from './SearchBar';
function EventCall() {
  const [view, setView] = useState('scheduledEvents');
  const [flash, setFlash] = useState(false);
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

        setScheduledEvents(response.data.events.filter(event => event.eventStatus === 'Upcoming' ));
        setOngoingEvents(response.data.events.filter(event => event.eventStatus === 'Ongoing'));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const triggerFlashEffect = (callback) => {
    setFlash(true);
    setTimeout(() => {
      callback();
      setFlash(false);
    }, 500); // Match the duration of the flash animation
  };

  const handleCreateEventClick = () => {
    triggerFlashEffect(() => setView('createEvent'));
  };

  const handleViewEventsClick = () => {
    triggerFlashEffect(() => setView('myEvents'));
  };

  const handleViewScheduledEventsClick = () => {
    triggerFlashEffect(() => setView('scheduledEvents'));
    setSelectedGenre('');
  };

  const handleViewOngoingEventsClick = () => {
    triggerFlashEffect(() => setView('ongoingEvents'));
    setSelectedGenre('');
  };


  const handleGenreChange = (genre) => {
    triggerFlashEffect(() => setSelectedGenre(genre));
  };

  const filteredScheduledEvents = scheduledEvents.filter(event => {
    return (
      (selectedGenre === '' || event.eventGenre === selectedGenre) &&
      (searchQuery === '' || event.eventName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredOngoingEvents = ongoingEvents.filter(event => {
    return (
      (selectedGenre === '' || event.eventGenre === selectedGenre) &&
      (searchQuery === '' || event.eventName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className={`flex flex-col ${flash ? 'animate-flash' : ''}`}>
      <HeaderComponent
        onCreateEvent={handleCreateEventClick}
        onViewEvents={handleViewEventsClick}
      />
      {view !== 'createEvent' && view !== 'myEvents' && (
        <>
          <nav className="flex justify-center items-center text-center">
            <span
              className={`m-2 text-m cursor-pointer ${view === 'scheduledEvents' ? 'text-indigo-500 text-l' : 'hover:text-indigo-500'}`}
              onClick={handleViewScheduledEventsClick}
            >
              Scheduled Events
            </span>
            <span
              className={`m-2 cursor-pointer text-m ${view === 'ongoingEvents' ? 'text-l text-indigo-500 ' : 'hover:text-indigo-500'}`}
              onClick={handleViewOngoingEventsClick}
            >
              Ongoing Events
            </span>
          </nav>
          <div className="flex justify-between w-full py-2">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <GenreSelector selectedGenre={selectedGenre} setSelectedGenre={handleGenreChange} />
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
