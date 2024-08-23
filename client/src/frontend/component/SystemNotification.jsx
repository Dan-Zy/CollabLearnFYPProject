import React, { useState, useEffect } from "react";

const Notification = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "text-green-500 border-b-green-500";
      case "error":
        return "text-red-500 border-red-500";
      case "info":
        return "text-blue-500 border-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div
      className={`${getBackgroundColor()} fixed top-2 left-100 bg-slate-100 border right-0 w-[50vh] rounded-lg  py-3 px-4 shadow-xl text-center z-50`}
    >
      {message}
    </div>
  );
};

export default Notification;
