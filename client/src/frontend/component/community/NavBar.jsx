import React from "react";

export function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center">
      <span
        className={`cursor-pointer ${
          activeTab === "joined"
            ? "border-b-2 border-indigo-500 text-indigo-500"
            : "text-gray-600 hover:text-indigo-500"
        }`}
        onClick={() => setActiveTab("joined")}
      >
        Joined
      </span>
      <span
        className={`cursor-pointer ml-4 ${
          activeTab === "suggested"
            ? "border-b-2 border-indigo-500 text-indigo-500"
            : "text-gray-600 hover:text-indigo-500"
        }`}
        onClick={() => setActiveTab("suggested")}
      >
        Suggested
      </span>
      <span
        className={`cursor-pointer ml-4 ${
          activeTab === "my-communities"
            ? "border-b-2 border-indigo-500 text-indigo-500"
            : "text-gray-600 hover:text-indigo-500"
        }`}
        onClick={() => setActiveTab("my-communities")}
      >
        My Communities
      </span>
    </div>
  );
}
