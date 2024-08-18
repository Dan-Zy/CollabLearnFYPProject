import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { setupJitsiMeeting } from '../../../JitsiMeet/jitsiMeet';

function CommunityEvents({ communityId }) {
  const jitsiContainerRef = useRef(null);
  const [roomName, setRoomName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [eventDescription, setEventDescription] = useState(""); 
  const [eventLink, setEventLink] = useState("");
  const [community, setCommunity] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchCommunity = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/collablearn/getCommunity/${communityId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setCommunity(res.data.community);

        const user = JSON.parse(localStorage.getItem("userInfo"));
        setIsAdmin(res.data.community.adminId._id === user._id);

        // Fetch the events
        fetchEvents(token);
      } catch (error) {
        console.error('Error fetching community', error);
      }
    };

    fetchCommunity();
  }, [communityId]);

  // Separate method for fetching events
  const fetchEvents = async (token) => {
    try {
      const resp = await axios.get(
        `http://localhost:3001/collablearn/getCommunityEvents/${communityId}`,
        {
          headers: {
            Authorization: `${token}`
          },
        }
      );
      setEvents(resp.data.Events);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const handleCreateEvent = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    const domain = "meet.jit.si"; 
    const newEventLink = `https://meet.jit.si/${roomName}`;
    setEventLink(newEventLink);

    const eventData = {
      eventName: eventTitle,
      eventDescription,
      type: "Instant",
      hostId: user._id,
      eventGenre: genre,
      eventLink: newEventLink,
    };

    try {
      const response = await axios.post(
        `http://localhost:3001/collablearn/createEventCommunity/${communityId}`,
        eventData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data.message);

        const configOverwrite = {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
        };

        setupJitsiMeeting({
          domain,
          roomName,
          displayName: user.username,
          email: user.email,
          jitsiContainerRef,
          configOverwrite,
          userInfo: { displayName: user.username },
        });

        // Fetch the updated list of events after creating a new one
        fetchEvents(token);
      } else {
        console.log("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="flex flex-col w-full items-center">
      {isAdmin && (
        <div className="flex flex-col w-full bg-white shadow-md rounded-lg m-1 p-4 lg:flex-2 sm:flex-1 text-[1vw] min-h-[200px]">
          <h3 className="text-2xl text-[#7d7dc3] antialiased font-bold m-2">Go Live</h3>
          <p className="text-l m-2">Go live by yourself or with others</p>

          <div className="flex w-full flex-wrap items-center justify-between">
            <input
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              type="text"
              placeholder="Title of event"
              className="flex-1 text-center m-2 h-[5vh] min-w-[180px] border border-[#7d7dc3] rounded"
            />

            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              type="text"
              placeholder="Enter your room name"
              className="flex-1 text-center m-2 h-[5vh] min-w-[180px] border border-[#7d7dc3] rounded"
            />

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="flex-1 text-center m-2 h-[5vh] min-w-[180px] border border-[#7d7dc3] rounded"
            >
              <option value="" disabled>Select a genre</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Networking">Networking</option>
              <option value="Human Computer Interaction">Human Computer Interaction</option>
              <option value="Data Science">Data Science</option>
              <option value="Software Development">Software Development</option>
              <option value="Other">Other</option>
            </select>

            <input
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              type="text"
              placeholder="Event Description"
              className="flex-1 text-center m-2 h-[5vh] min-w-[180px] border border-[#7d7dc3] rounded"
            />
          </div>

          <button
            onClick={handleCreateEvent}
            className="flex justify-center text-center text-white bg-indigo-500 text-[1vw] p-2 rounded hover:bg-indigo-600"
          >
            GoLive
          </button>
        </div>
      )}

      <div className="w-full flex flex-wrap justify-center">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="flex flex-col m-4 items-center justify-center bg-white shadow-lg rounded-lg">
              <div className="flex w-[80%] flex-row pt-4">
                <img
                  src={event.hostId?.profilePicture ? `http://localhost:3001/${event.hostId?.profilePicture}` : "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="rounded-full w-10 h-10 mr-3"
                />
                <div className='flex flex-col justify-left item-left text-left'>
                  <p className="text-sm text-gray-500">Created by</p>
                  <h4 className="font-semibold">{event.hostId?.username || 'Unknown Host'}</h4>
                </div>
              </div>
              <div className="flex w-[80%] flex-row p-4">
                <h2 className="flex-1 text-lg font-bold text-start">{event.eventName}</h2>
              </div>
              <div className="grid grid-cols-8 gap-1 p-2 w-[80%] opacity-60">
                {event.numberOfParticipants.length > 0 ? (
                  event.numberOfParticipants.slice(0, 12).map((participant, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001/${participant?.profilePicture}`}
                      alt={`Participant ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">No participants yet</div>
                )}
                {event.numberOfParticipants.length > 12 && (
                  <div className="flex items-center justify-center bg-gray-200 rounded">
                    <span className="text-sm text-gray-700">+{event.numberOfParticipants.length - 12}</span>
                  </div>
                )}
              </div>
              <div className="pl-4 text-center w-[85%]">
                <div className="flex w-[100%] flex-row p-4">
                  <h2 className="flex-1 text-m  text-start">{event.eventDescription
                  }</h2>
                  <span className="inline-block bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                    {event.numberOfParticipants.length} joined
                  </span>
                </div>
                <div className='text-left font-light text-sm'>{event.createdAt}</div>
              </div>
              <a href={event.eventLink} target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="w-[85%] py-2 px-4 m-4 text-white rounded bg-indigo-500 hover:bg-indigo-600">
                  Join
                </button>
              </a>
            </div>
          ))
        ) : (
          <div>No events available.</div>
        )}
      </div>
    </div>
  );
}

export default CommunityEvents;
