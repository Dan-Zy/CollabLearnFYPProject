// MainPage.jsx
import React, { useState, useEffect } from "react";
import Header from "./component/Header";
import Sidebar from "./component/SideBar";
import LeftSidebar from "./LeftSideBar";
import MainPageCollab from "./component/Collabler/MainPage";
import { PostCall } from "./component/NewsFeed";
import EventCall from "./component/Event/EventCall";
import Profile from "./component/UserProfile/Profile";
import { CommunityHome } from "./component/community/CommunityHome";
import SearchResults from "./component/Searching/SearchResults";
import Screen from "./component/AI _Asistant/Screen";
import "../App.css";

export function MainPage() {
  const [activeItem, setActiveItem] = useState(localStorage.getItem('activeItem') || 'Home'); 
  const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [searchQuery, setSearchQuery] = useState(''); // Add state for search query

  useEffect(() => {
    localStorage.setItem('activeItem', activeItem);
  }, [activeItem]);

  const handleSetActiveItem = (item) => {
    setActiveItem(item);
  };

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
    setActiveItem('Search'); // Set active item to search when user types in search bar
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
        <Header onSearchInputChange={handleSearchInputChange} />
        {activeItem === 'Home' && <PostCall />}
        {activeItem === 'My Collabs' && <MainPageCollab />}
        {activeItem === 'Events' && <EventCall />}
        {activeItem === 'Community' && <CommunityHome />}
        {activeItem === 'Help' && <Screen />}
        {activeItem === 'Profile' && <Profile userId={userId._id} />}
        {activeItem === 'Search' && <SearchResults query={searchQuery} />} {/* Render search results */}
      </div>
      <div className="flex w-1/5 justify-center h-full ">
        <LeftSidebar handleSetActiveItem={handleSetActiveItem} />
      </div>
    </div>
  );
}
