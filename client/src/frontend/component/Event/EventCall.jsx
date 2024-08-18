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
  const [view, setView] = useState(() => localStorage.getItem('eventCallView') || 'scheduledEvents');
  const [flash, setFlash] = useState(false);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(() => localStorage.getItem('eventCallGenre') || '');
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('eventCallSearchQuery') || '');

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

  useEffect(() => {
    localStorage.setItem('eventCallView', view);
    localStorage.setItem('eventCallGenre', selectedGenre);
    localStorage.setItem('eventCallSearchQuery', searchQuery);
  }, [view, selectedGenre, searchQuery]);

  const triggerFlashEffect = (callback) => {
    setFlash(true);
    setTimeout(() => {
      callback();
      setFlash(false);
    }, 500);
  };

  const handleCreateEventClick = () => {
    localStorage.setItem('previousView', view);
    triggerFlashEffect(() => setView('createEvent'));
  };

  const handleViewEventsClick = () => {
    localStorage.setItem('previousView', view);
    triggerFlashEffect(() => setView('myEvents'));
  };

  const handleGoBack = () => {
    const previousView = localStorage.getItem('previousView');
    if (previousView) {
      triggerFlashEffect(() => setView(previousView));
      localStorage.removeItem('previousView'); // Clear previous view to prevent unintended navigation
    }
  };

  const handleViewScheduledEventsClick = () => {
    localStorage.setItem('previousView', view);
    triggerFlashEffect(() => {
      setView('scheduledEvents');
      setSelectedGenre('');
    });
  };

  const handleViewOngoingEventsClick = () => {
    localStorage.setItem('previousView', view);
    triggerFlashEffect(() => {
      setView('ongoingEvents');
      setSelectedGenre('');
    });
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
              className={`m-0 text-m cursor-pointer ${view === 'scheduledEvents' ? 'text-indigo-500 text-l' : 'hover:text-indigo-500'}`}
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
      {view === 'createEvent' && <CreateEvent onGoBack={handleGoBack} />}
      {view === 'myEvents' && <MyEvent onGoBack={handleGoBack} />}
    </div>
  );
}

export default EventCall;
