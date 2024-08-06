import React, { useState } from "react";
import "../App.css"; // Make sure to import your Tailwind CSS file
import LogOut from "./component/LogOut";
import { ChatBox } from "./component/chattest/ChatBox";

const LeftSidebar = ({ handleSetActiveItem }) => { // Accept the function as a prop
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <aside className="bg-white shadow-md border-r h-screen transition-all">
      {/* Profile Section */}
      <div>
        <LogOut handleSetActiveItem={handleSetActiveItem} />
      </div>

      {/* Tabs Section */}
      <div className="flex justify-between p-4 border-b">
        <button
          onClick={() => setActiveTab("chat")}
          className={`w-1/2 text-center py-2 ${
            activeTab === "chat"
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-indigo-50 text-gray-600"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`w-1/2 text-center py-2 ${
            activeTab === "events"
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500"
              : "hover:bg-indigo-50 text-gray-600"
          }`}
        >
          Events
        </button>
      </div>

      {/* User List Section */}
      <div className="p-0 flex-1 ">
        {activeTab === "chat" && <ChatBox />}
        {activeTab === "events" && <div>Events content here...</div>}
      </div>

      {/* Footer Section */}
    </aside>
  );
};

export default LeftSidebar;
