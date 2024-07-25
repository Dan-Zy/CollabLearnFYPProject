import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faImage,
  faHeading,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateEventCard() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [poster, setPoster] = useState(null);
  const [eventDescription, setEventDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [genre, setGenre] = useState("");

  const [showTitle, setShowTitle] = useState(false);
  const [showEventDescription, setShowEventDescription] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [showGenre, setShowGenre] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !eventDescription ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !poster ||
      !genre
    ) {
      toast.error("All fields are required for scheduled events");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const now = new Date();

    if (startDateTime < now) {
      toast.error("Start date and time cannot be in the past");
      return;
    }

    if (endDateTime < startDateTime) {
      toast.error("End date and time must be greater than or equal to the start date and time");
      return;
    }

    // Generate a random room name for Jitsi meeting link
    const roomName = `event-${Date.now()}`;
    const jitsiLink = `https://meet.jit.si/${roomName}`;

    // Change date format from YYYY-MM-DD to DD-MM-YYYY
    const formatDate = (date) => {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    };

    const startNewDate = formatDate(startDate);
    const endNewDate = formatDate(endDate);

    const formData = new FormData();
    formData.append("eventName", title);
    formData.append("eventDescription", eventDescription);
    formData.append("type", "Scheduled");
    formData.append("startDate", startNewDate);
    formData.append("endDate", endNewDate);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("eventGenre", genre);
    formData.append("eventLink", jitsiLink); // Add the Jitsi meeting link
    if (poster) {
      formData.append("image", poster);
    }

    try {
      const token = localStorage.getItem('token');
      await toast.promise(
        axios.post(
          "http://localhost:3001/collablearn/createEvent",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        ),
        {
          pending: "Creating event...",
          success: "Event created successfully!",
          error: "Error creating event. Please try again.",
        }
      );


      setTitle("");
      setEventDescription("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setGenre("");
      setPoster(null);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-[60vh] w-full bg-white shadow-md rounded-lg m-1 p-1 lg:flex-2 sm:flex-1 text-[1vw]">
      <h3 className="text-2xl text-[#7d7dc3] antialiased font-bold m-2">
        Create Scheduled Event
      </h3>
      <p className="text-l m-2">Go live by yourself or with others</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center flex-1 overflow-y-auto "
      >
        <div className="flex flex-wrap justify-center w-full">
          <div className="m-2 flex items-center">
            <FontAwesomeIcon
              icon={faHeading}
              className="text-[#7d7dc3] cursor-pointer"
              onClick={() => setShowTitle(!showTitle)}
            />
            <span className="ml-2">Title</span>
          </div>
          {showTitle && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title of event"
              className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
            />
          )}

          <div className="m-2 flex items-center">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-[#7d7dc3] cursor-pointer"
              onClick={() => setShowEventDescription(!showEventDescription)}
            />
            <span className="ml-2">Description</span>
          </div>
          {showEventDescription && (
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Event Description"
              className="flex text-center flex-col m-2 h-[10vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
            />
          )}

          <div className="m-2 flex items-center">
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-[#7d7dc3] cursor-pointer"
              onClick={() => setShowStartDate(!showStartDate)}
            />
            <span className="ml-2">Start Date</span>
          </div>
          {showStartDate && (
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
            />
          )}

          <div className="m-2 flex items-center">
            <FontAwesomeIcon
              icon={faClock}
              className="text-[#7d7dc3] cursor-pointer"
              onClick={() => setShowStartTime(!showStartTime)}
            />
            <span className="ml-2">Start Time</span>
          </div>
          {showStartTime && (
            <input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              type="time"
              className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
            />
          )}

          <div className="m-2 flex items-center">
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-[#7d7dc3] cursor-pointer"
              onClick={() => setShowEndDate(!showEndDate)}
            />
            <span className="ml-2">End Date</span>
          </div>
          {showEndDate && (
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
            />
          )}

          <div className="m-2 flex items-center">
            <FontAwesomeIcon
              icon={faClock}
              className="text-[#7d7dc3] cursor-pointer"
              onClick={() => setShowEndTime(!showEndTime)}
            />
            <span className="ml-2">End Time</span>
          </div>
          {showEndTime && (
            <input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              type="time"
              className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
            />
          )}

          <div className="m-2 flex items-center">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-[#7d7dc3] cursor-pointer"
              onClick={() => setShowGenre(!showGenre)}
            />
            <span className="ml-2">Genre</span>
          </div>
          {showGenre && (
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
          )}

          <div className="m-2 flex items-center">
            <FontAwesomeIcon
              icon={faImage}
              className="text-[#7d7dc3] cursor-pointer"
              onClick={() => setShowPoster(!showPoster)}
            />
            <span className="ml-2">Upload Poster</span>
          </div>
          {showPoster && (
            <input
              type="file"
              onChange={(e) => setPoster(e.target.files[0])}
              className="flex text-center flex-col m-2 h-[5vh] w-[80%] justify-center items-center border border-[#7d7dc3] rounded"
            />
          )}
        </div>
        <button
          type="submit"
          className="flex text-center flex-col m-2 h-[5vh] w-[30%] justify-center items-center border bg-[#7d7dc3] text-white rounded"
        >
          Create Event
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CreateEventCard;
