import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import GoLiveCard from './GoLiveCard';
import CreateEventCard from './CreateEventCard';

function CreateEvent({ onGoBack }) {

  useEffect(() => {
    localStorage.setItem('myEventView', 'createEvent');
  }, []);

  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-start w-full pl-2">
        <button onClick={onGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-500 text-xl hover:text-indigo-600" />
        </button>
      </div>
      <div className="flex items-center justify-center text-[1.5vw] m-0">
        Welcome back, Muhammad Hassan!
      </div>
      <div className="flex flex-row justify-center items-center flex-wrap gap-4">
        <GoLiveCard />
        <CreateEventCard />
      </div>
    </div>
  );
}

export default CreateEvent;
