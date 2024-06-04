import React, { useState } from "react";
import Header from "./component/Header";
import Sidebar from "./component/SideBar";
import LeftSidebar from "./LeftSideBar";
import CollaboratorList from "./component/Collabler/CollaboratorList";
import { PostCall } from "./component/NewsFeed";
import EventCall from "./component/Event/EventCall";

import "../App.css";

export function MainPage() {
  const [activeItem, setActiveItem] = useState('Home'); // State to track the active item

  return (
    <div className="flex flex-wrap gap-1 h-screen" style={{ width: "100vw" }}>
      <div className="flex-none h-full overflow-y-auto custom-scrollbar ">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} /> {/* Pass state and setter */}
      </div>
      <div
        className="flex-auto bg-gray-100 h-full overflow-y-auto custom-scrollbar"
        style={{ width: "60%" }}
      >
        <Header />
        {activeItem === 'Home' && <PostCall />}
        {activeItem === 'My Collabs' && <CollaboratorList />}
        {activeItem === 'Events' && <EventCall />}
        {/* Render other components based on the active item */}
      </div>
      <div className="flex w-1/5 justify-center h-full overflow-y-auto custom-scrollbar">
        <LeftSidebar />
      </div>
    </div>
  );
}
