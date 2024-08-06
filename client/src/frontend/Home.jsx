import React, { useState, useEffect } from "react";
import Header from "./component/Header";
import Sidebar from "./component/SideBar";
import LeftSidebar from "./LeftSideBar";
import CollaboratorList from "./component/Collabler/CollaboratorList";
import { PostCall } from "./component/NewsFeed";
import EventCall from "./component/Event/EventCall";
import Profile from "./component/UserProfile/Profile";
import { CommunityHome } from "./component/community/CommunityHome";
import "../App.css";

export function MainPage() {
  const [activeItem, setActiveItem] = useState(localStorage.getItem('activeItem') || 'Home'); 
  const [userId ,setUserId]=useState(JSON.parse(localStorage.getItem('userInfo')));
  useEffect(() => {
    localStorage.setItem('activeItem', activeItem);
  
  }, [activeItem]);

  const handleSetActiveItem = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="flex flex-wrap h-screen" style={{ width: "100vw" }}>
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
        {activeItem === 'Community' && <CommunityHome />}
        {activeItem === 'Profile' && <Profile userId = {userId._id} />}
      </div>
      <div className="flex w-1/5 justify-center h-full ">
        <LeftSidebar handleSetActiveItem={handleSetActiveItem} />
      </div>
    </div>
  );
}
