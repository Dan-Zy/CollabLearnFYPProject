import React from 'react';
import Header from '../HeaderComponent';
import GoLiveCard from './GoLiveCard';
import CreateEventCard from './CreateEventCard';
function CreateEvent() {
  
  
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex items-center justify-center text-[1.5vw] my-4">
        Welcome back, Muhammad Hassan!
      </div>
      <div className="flex flex-row justify-center items-center flex-wrap gap-4">
          <GoLiveCard/>
          <CreateEventCard/>
      </div>
    </div>
  );
}

export default CreateEvent;
