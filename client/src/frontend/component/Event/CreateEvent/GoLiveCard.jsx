import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { setupJitsiMeeting } from "../../JitsiMeet/jitsiMeet";

function GoLiveCard() {
  const jitsiContainerRef = useRef(null);
  const [roomName, setRoomName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState(null);
  const [eventDescription, setEventDescription] = useState(""); // New state for description
  const [eventLink, setEventLink] = useState(""); // New state for event link

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "meetingEnded") {
        console.log("The meeting has been ended");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleClick = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    const displayName = user.username;
    const email = user.email;
    const domain = "meet.jit.si"; // Replace with your Jitsi Meet domain
    setEventLink(`https://meet.jit.si/${roomName}`);
    const eventData = new FormData();
    eventData.append("eventName", eventTitle);
    eventData.append("eventDescription", eventDescription); // Append description
    eventData.append("type", "Instant");
    eventData.append("hostId", user._id);
    eventData.append("eventGenre", genre);
    eventData.append("eventLink", eventLink); // Append event link
    // if (poster) {
    //   eventData.append("image", poster);
    // }

    try {
      const response = await axios.post(
        "http://localhost:3001/collablearn/createEvent",
        eventData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
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
          displayName,
          email,
          jitsiContainerRef,
          configOverwrite,
          userInfo: { displayName },
        });
      } else {
        console.log("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] w-[95%] bg-white shadow-md rounded-lg m-1 p-1 lg:flex-2 sm:flex-1 text-[1vw]">
      <div className="flex flex-col items-center flex-1">
        <h3 className="text-2xl text-[#7d7dc3] antialiased font-bold m-2">
          Golive
        </h3>
        <p className="text-l m-2">Go live by yourself or with others</p>

        <input
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          type="text"
          placeholder="Title of event"
          className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
        />

        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          type="text"
          placeholder="Enter your room name"
          className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
        >
          <option value="" disabled>
            Select a genre
          </option>
          <option value="Artificial Intelligence">
            Artificial Intelligence
          </option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Networking">Networking</option>
          <option value="Human Computer Interaction">
            Human Computer Interaction
          </option>
          <option value="Data Science">Data Science</option>
          <option value="Software Development">Software Development</option>
          <option value="Other">Other</option>
        </select>

        <input
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          type="text"
          placeholder="Event Description"
          className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
        />



      </div>
      <button
        onClick={handleClick}
        className="flex justify-center text-center text-white bg-indigo-500 text-[1vw] p-2 rounded hover:bg-indigo-600"
      >
        GoLive
      </button>
    </div>
  );
}

export default GoLiveCard;
