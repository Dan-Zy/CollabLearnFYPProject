import React, { useState } from 'react';

function NavBar({ name }) { 
  const [activeLink, setActiveLink] = useState(name);

  const handleLinkClick = (href) => {
    setActiveLink(href);
  };

  return (
<nav className="navigation flex justify-around items-center text-base border-b border-gray-300 py-2">
  <a className={`nav-link ${activeLink === '/CommunityHome' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-700'}`} href="/CommunityHome" onClick={() => handleLinkClick('/CommunityHome')}>
    Feed
  </a>
  <a className={`nav-link ${activeLink === '/about' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-700'}`} href="/about" onClick={() => handleLinkClick('/about')}>
    About
  </a>
  <a className={`nav-link ${activeLink === '/CommunityEvent' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-700'}`} href="/CommunityEvent" onClick={() => handleLinkClick('/CommunityEvent')}>
    Event
  </a>
  <a className={`nav-link ${activeLink === '/CommunityDF' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-700'}`} href="/CommunityDF" onClick={() => handleLinkClick('/CommunityDF')}>
    Discussion Forum
  </a>
</nav>

  );
}

export default NavBar;
