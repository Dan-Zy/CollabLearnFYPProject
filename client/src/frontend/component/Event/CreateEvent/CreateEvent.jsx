import React from 'react';
import Header from '../HeaderComponent';
import EventOptionCard from './EventOptionCard';

function CreateEvent() {
  const eventOptions = [
    {
      icon: '', 
      title: 'Go live',
      description: 'Go live by yourself or with others',
      buttonText: 'Go Live'
    },
    {
      icon: '', 
      title: 'Create live video event',
      description: 'Create an event ahead of time to share with your audience',
      buttonText: 'Create Event'
    }
  ];

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex items-center justify-center text-[1.5vw] my-4">
        Welcome back, Muhammad Hassan!
      </div>
      <div className="flex flex-row justify-center items-center flex-wrap gap-4">
        {eventOptions.map((option, index) => (
          <EventOptionCard
            key={index}
            icon={option.icon}
            title={option.title}
            description={option.description}
            buttonText={option.buttonText}
          />
        ))}
      </div>
    </div>
  );
}

export default CreateEvent;
