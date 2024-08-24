import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { setupJitsiMeeting } from "../../JitsiMeet/jitsiMeet";
import Notification from "../../SystemNotification"; // Import your Notification component

function GoLiveCard() {
  const jitsiContainerRef = useRef(null);
  const [roomName, setRoomName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState(null);
  const [eventDescription, setEventDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: "", type: "" });

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

  const validateForm = () => {
    const newErrors = {};
    if (!eventTitle) newErrors.eventTitle = "Event title is required";
    if (!roomName) newErrors.roomName = "Room name is required";
    if (!genre) newErrors.genre = "Genre is required";
    if (!eventDescription) newErrors.eventDescription = "Event description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const user = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    const displayName = user.username;
    const email = user.email;
    const domain = "meet.jit.si";
    const generatedEventLink = `https://meet.jit.si/${roomName}`;
    
    const eventData = new FormData();
    eventData.append("eventName", eventTitle);
    eventData.append("eventDescription", eventDescription);
    eventData.append("type", "Instant");
    eventData.append("hostId", user._id);
    eventData.append("eventGenre", genre);
    eventData.append("eventLink", generatedEventLink);

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
        setNotification({ message: "Event created successfully!", type: "success" });

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

        // Reset the form
        setRoomName("");
        setEventTitle("");
        setGenre("");
        setEventDescription("");
        setPoster(null); // if you add poster upload functionality
        setErrors({}); // Clear any validation errors
      } else {
        setNotification({ message: "Failed to create event.", type: "error" });
      }
    } catch (error) {
      setRoomName("");
      setEventTitle("");
      setGenre("");
      setEventDescription("");
      setPoster(null); // if you add poster upload functionality
      setErrors({});
      setNotification({ message: "Event created successfully!", type: "success" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] w-[95%] bg-white shadow-md rounded-lg m-1 p-1 lg:flex-2 sm:flex-1 text-[1vw]">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}

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
          className={`flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border ${errors.eventTitle ? 'border-red-500' : 'border-[#7d7dc3]'} rounded`}
        />
        {errors.eventTitle && <p className="text-red-500 text-sm">{errors.eventTitle}</p>}

        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          type="text"
          placeholder="Enter your room name"
          className={`flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border ${errors.roomName ? 'border-red-500' : 'border-[#7d7dc3]'} rounded`}
        />
        {errors.roomName && <p className="text-red-500 text-sm">{errors.roomName}</p>}

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className={`flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border ${errors.genre ? 'border-red-500' : 'border-[#7d7dc3]'} rounded`}
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
        {errors.genre && <p className="text-red-500 text-sm">{errors.genre}</p>}

        <input
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          type="text"
          placeholder="Event Description"
          className={`flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border ${errors.eventDescription ? 'border-red-500' : 'border-[#7d7dc3]'} rounded`}
        />
        {errors.eventDescription && <p className="text-red-500 text-sm">{errors.eventDescription}</p>}

      </div>
      <button
        onClick={handleClick}
        disabled={isSubmitting}
        className={`flex justify-center text-center text-white bg-indigo-500 text-[1vw] p-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'}`}
      >
        {isSubmitting ? "In Process..." : "GoLive"}
      </button>
    </div>
  );
}

export default GoLiveCard;
