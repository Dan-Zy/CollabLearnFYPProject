import React, { useState } from 'react';

function NavBar({ activeLink, setActiveLink, setView }) { 
  const handleLinkClick = (href) => {
    setActiveLink(href);
    setView(href);
  };

  return (
    <nav className="navigation flex justify-between items-center text-base border-b border-gray-300 py-2 w-full">
      <a className={`nav-link ${activeLink === 'Feed' ? 'flex-1 text-l border-b-2 border-indigo-600 text-indigo-600' : 'flex-1 text-sm text-gray-700'}`} onClick={() => handleLinkClick('Feed')}>
        Feed
      </a>
      <a className={`nav-link ${activeLink === 'About' ? 'flex-1 text-l border-b-2 border-indigo-600 text-indigo-600' : 'flex-1 text-sm text-gray-700'}`} onClick={() => handleLinkClick('About')}>
        About
      </a>
      <a className={`nav-link ${activeLink === 'CommunityEvent' ? 'flex-1 text-l border-b-2 border-indigo-600 text-indigo-600' : 'flex-1 text-sm text-gray-700'}`} onClick={() => handleLinkClick('CommunityEvent')}>
        Event
      </a>
      <a className={`nav-link ${activeLink === 'CommunityDF' ? 'flex-1 border-b-2 text-l border-indigo-600 text-indigo-600' : 'flex-1 text-sm text-gray-700'}`} onClick={() => handleLinkClick('CommunityDF')}>
        Discussion Forum
      </a>
    </nav>
  );
}

export default NavBar;
