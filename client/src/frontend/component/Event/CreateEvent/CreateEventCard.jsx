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

  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!title) {
      newErrors.title = "Title is required";
      setShowTitle(true);
    }
    if (!eventDescription) {
      newErrors.eventDescription = "Description is required";
      setShowEventDescription(true);
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required";
      setShowStartDate(true);
    }
    if (!startTime) {
      newErrors.startTime = "Start time is required";
      setShowStartTime(true);
    }
    if (!endDate) {
      newErrors.endDate = "End date is required";
      setShowEndDate(true);
    }
    if (!endTime) {
      newErrors.endTime = "End time is required";
      setShowEndTime(true);
    }
    if (!poster) {
      newErrors.poster = "Poster is required";
      setShowPoster(true);
    }
    if (!genre) {
      newErrors.genre = "Genre is required";
      setShowGenre(true);
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all the required fields");
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

    const roomName = `event-${Date.now()}`;
    const jitsiLink = `https://meet.jit.si/${roomName}`;

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
    formData.append("eventLink", jitsiLink);
    if (poster) {
      formData.append("image", poster);
    }

    try {
      const token = localStorage.getItem("token");
      await toast.promise(
        axios.post("http://localhost:3001/collablearn/createEvent", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }),
        {
          pending: "Creating event...",
          success: "Event created successfully!",
          error: "Error creating event. Please try again.",
        }
      );

      // Reset all fields after event creation
      setTitle("");
      setEventDescription("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setGenre("");
      setPoster(null);
      setErrors({});
      setShowTitle(false);
      setShowEventDescription(false);
      setShowStartDate(false);
      setShowStartTime(false);
      setShowEndDate(false);
      setShowEndTime(false);
      setShowPoster(false);
      setShowGenre(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event. Please try again.");
    }
  };

  return (
    <section className="flex flex-col h-[60vh] w-full bg-white shadow-md rounded-lg m-1 p-1 lg:flex-2 sm:flex-1 text-[1vw]">
      <h3 className="text-2xl text-[#7d7dc3] antialiased font-bold m-2">
        Create Scheduled Event
      </h3>
      <p className="text-l m-2">Go live by yourself or with others</p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center flex-1 overflow-y-auto">
        <fieldset className="flex flex-wrap justify-center w-full">
          <legend className="sr-only">Event Details</legend>
          <div className="m-2 flex items-center" onClick={() => setShowTitle(!showTitle)}>
            <FontAwesomeIcon
              icon={faHeading}
              className="text-[#7d7dc3] cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">Title</span>
          </div>
          {showTitle && (
            <div className="w-full flex justify-center">
              <label htmlFor="title" className="sr-only">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title of event"
                className="text-center m-2 h-[5vh] w-[80%] border border-[#7d7dc3] rounded"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>
          )}

          <div className="m-2 flex items-center" onClick={() => setShowEventDescription(!showEventDescription)}>
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-[#7d7dc3] cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">Description</span>
          </div>
          {showEventDescription && (
            <div className="w-full flex justify-center">
              <label htmlFor="eventDescription" className="sr-only">Description</label>
              <textarea
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Event Description"
                className="text-center m-2 h-[10vh] w-[80%] border border-[#7d7dc3] rounded"
              />
              {errors.eventDescription && (
                <p className="text-red-500 text-sm">{errors.eventDescription}</p>
              )}
            </div>
          )}

          <div className="m-2 flex items-center" onClick={() => setShowStartDate(!showStartDate)}>
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-[#7d7dc3] cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">Start Date</span>
          </div>
          {showStartDate && (
            <div className="w-full flex justify-center">
              <label htmlFor="startDate" className="sr-only">Start Date</label>
              <input
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                type="date"
                placeholder="Start Date"
                className="text-center m-2 h-[5vh] w-[80%] border border-[#7d7dc3] rounded"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
          )}

          <div className="m-2 flex items-center" onClick={() => setShowStartTime(!showStartTime)}>
            <FontAwesomeIcon
              icon={faClock}
              className="text-[#7d7dc3] cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">Start Time</span>
          </div>
          {showStartTime && (
            <div className="w-full flex justify-center">
              <label htmlFor="startTime" className="sr-only">Start Time</label>
              <input
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                type="time"
                placeholder="Start Time"
                className="text-center m-2 h-[5vh] w-[80%] border border-[#7d7dc3] rounded"
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm">{errors.startTime}</p>
              )}
            </div>
          )}

          <div className="m-2 flex items-center" onClick={() => setShowEndDate(!showEndDate)}>
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-[#7d7dc3] cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">End Date</span>
          </div>
          {showEndDate && (
            <div className="w-full flex justify-center">
              <label htmlFor="endDate" className="sr-only">End Date</label>
              <input
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
                placeholder="End Date"
                className="text-center m-2 h-[5vh] w-[80%] border border-[#7d7dc3] rounded"
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate}</p>
              )}
            </div>
          )}

          <div className="m-2 flex items-center" onClick={() => setShowEndTime(!showEndTime)}>
            <FontAwesomeIcon
              icon={faClock}
              className="text-[#7d7dc3] cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">End Time</span>
          </div>
          {showEndTime && (
            <div className="w-full flex justify-center">
              <label htmlFor="endTime" className="sr-only">End Time</label>
              <input
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                type="time"
                placeholder="End Time"
                className="text-center m-2 h-[5vh] w-[80%] border border-[#7d7dc3] rounded"
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm">{errors.endTime}</p>
              )}
            </div>
          )}

          <div className="m-2 flex items-center" onClick={() => setShowPoster(!showPoster)}>
            <FontAwesomeIcon
              icon={faImage}
              className="text-[#7d7dc3] cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">Poster</span>
          </div>
          {showPoster && (
            <div className="w-full flex justify-center">
              <label htmlFor="poster" className="sr-only">Poster</label>
              <input
                id="poster"
                onChange={(e) => setPoster(e.target.files[0])}
                type="file"
                className="text-center m-2 h-[5vh] w-[80%] border border-[#7d7dc3] rounded"
              />
              {errors.poster && (
                <p className="text-red-500 text-sm">{errors.poster}</p>
              )}
            </div>
          )}

          <div className="m-2 flex items-center" onClick={() => setShowGenre(!showGenre)}>
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-[#7d7dc3] cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">Genre</span>
          </div>
          {showGenre && (
            <div className="w-full flex justify-center">
              <label htmlFor="genre" className="sr-only">Genre</label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="text-center m-2 h-[5vh] w-[80%] border border-[#7d7dc3] rounded"
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
              {errors.genre && (
                <p className="text-red-500 text-sm">{errors.genre}</p>
              )}
            </div>
          )}

        </fieldset>
        <div className="w-full flex justify-center mt-4">
          <button
            type="submit"
            className="bg-[#7d7dc3] text-white font-bold py-2 px-4 rounded hover:bg-[#6c6ca7]"
          >
            Create Event
          </button>
        </div>
      </form>

      <ToastContainer />
    </section>
  );
}

export default CreateEventCard;
