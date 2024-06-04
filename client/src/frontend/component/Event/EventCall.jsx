import React from 'react';
import HeaderComponent from './HeaderComponent';
import EventCardComponent from './EventCard';
import img from '../../../assets/OIP (1).jfif';
import img2 from '../../../assets/OIP (2).jfif';

function EventCall() {
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
      <HeaderComponent />
      <section className="flex flex-col">
        {events.map((event, index) => (
          <EventCardComponent key={index} {...event} />
        ))}
      </section>
    </div>
  );
}

export default EventCall;
