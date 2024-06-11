import React from 'react';
import EventItem from './EventItem';
import HeaderComponent from '../HeaderComponent';

function MyEvent({ onCreateEvent, onViewEvents }) {
  const events = [
    {
        title: 'What is AI?',
        duration: '1-hour',
        start: 'In 5 mins',
      },
      {
        title: 'Basics of Programming',
        duration: '1-hour',
        start: 'In 3 hours 23 minutes',
      },
      {
          title: 'What is AI?',
          duration: '1-hour',
          start: 'In 5 mins',
        },
        {
          title: 'Basics of Programming',
          duration: '1-hour',
          start: 'In 3 hours 23 minutes',
        },
        {
          title: 'What is AI?',
          duration: '1-hour',
          start: 'In 5 mins',
        },
        {
          title: 'Basics of Programming',
          duration: '1-hour',
          start: 'In 3 hours 23 minutes',
        },
        {
          title: 'What is AI?',
          duration: '1-hour',
          start: 'In 5 mins',
        },
        {
          title: 'Basics of Programming',
          duration: '1-hour',
          start: 'In 3 hours 23 minutes',
        },
  ];

  return (
    <div className="flex justify-center items-center mr-5 ml-5">
      <div className="flex-1 justify-evenly sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <EventItem key={index} {...event} />
        ))}
      </div>
    </div>
  );
}

export default MyEvent;
