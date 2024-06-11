import React, { useState } from 'react';
import HeaderComponent from './HeaderComponent';
import EventCardComponent from './EventCard';
import CreateEvent from './CreateEvent/CreateEvent';
import MyEvent from './MyEvent/MyEvent';
import img from '../../../assets/OIP (1).jfif';
import img2 from '../../../assets/OIP (2).jfif';

function EventCall() {
  const [view, setView] = useState('events');

  const handleCreateEventClick = () => {
    setView('createEvent');
  };

  const handleViewEventsClick = () => {
    setView('myEvents');
  };

  const events = [
    {
      title: 'IT\'S GAME TIME',
      img: img,
      time: 'Streaming starts at 8 PM',
      interested: false,
    },
    {
      title: 'GAMING STREAM',
      img: img2,
      time: 'Streaming starts at 9 PM',
      interested: true,
    },
    {
      title: 'IT\'S GAME TIME',
      img: img,
      time: 'Streaming starts at 8 PM',
      interested: false,
    },
  ];

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
