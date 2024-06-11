import React, { useRef, useState } from 'react';

function CreateEventCard() {
    const [title , setTile] = useState('');
    const [StartTime , setStartTime] = useState('');
    const [Poster , setPoster] = useState('');
  return (
    <div className="flex flex-col h-[60vh] w-[95%] bg-white shadow-md rounded-lg m-1 p-1 lg:flex-2 sm:flex-1 text-[1vw]">
      <div className="flex flex-col items-center flex-1">
        {/* {icon} This will be the passed icon component */}
        <h3 className="text-2xl text-[#7d7dc3] antialiased font-bold  m-2">Create Event</h3>
        <p className="text-l m-2">Go live by yourself or with others</p>
        <p className="text-l font-bold text-[#7d7dc3]">Title</p>
        <input 
        value = {title}
        onChange={(e) => setTile(e.target.value)}
        type="text" placeholder='Title of event' className='flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded' />
        <p className="text-l font-bold text-[#7d7dc3]">Start time</p>
        <input 
        value = {StartTime}
        onChange={(e) => setStartTime(e.target.value)}
        type="time"  className='flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded' />
        <p className="text-l font-bold text-[#7d7dc3]">Event Poster</p>
        <input 
        value={Poster}
        onChange={(e) => setPoster(e.target.value)}
        type="file" accept='.png , .jpge'  className='flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded' />
       
      </div>
      <button
        
        className="flex justify-center text-center text-white bg-indigo-500 text-[1vw] p-2 rounded hover:bg-indigo-600"
      >
        Create Event
      </button>
    </div>
  );
}

export default CreateEventCard;
