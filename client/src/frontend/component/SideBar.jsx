import React, { useContext, createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Home, Users, Calendar, HelpCircle, MessageSquare, } from 'lucide-react';
import Logo from '../../assets/Logo.png';
import { CreatePostModal } from './CreatePost/CreatePostModal';

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('Home'); // State to track the active item

  return (
    <aside className="h-screen flex flex-col">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={Logo}
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-2">
            <SidebarItem icon={<Home />} text="Home" active={activeItem === 'Home'} onClick={() => setActiveItem('Home')} />
            <SidebarItem icon={<Users />} text="Community" active={activeItem === 'Community'} onClick={() => setActiveItem('Community')} />
            <SidebarItem icon={<Calendar />} text="Events" active={activeItem === 'Events'} onClick={() => setActiveItem('Events')} />
            <SidebarItem icon={<Users />} text="My Collabs" active={activeItem === 'My Collabs'} onClick={() => setActiveItem('My Collabs')} />
            <div className="border-t my-2" />
            <SidebarItem icon={<HelpCircle />} text="Help" active={activeItem === 'Help'} onClick={() => setActiveItem('Help')} />
            <SidebarItem icon={<MessageSquare />} text="Feedback" active={activeItem === 'Feedback'} onClick={() => setActiveItem('Feedback')} />
            {children}
          </ul>
        </SidebarContext.Provider>

        <div className="p-3 flex justify-center">
          <CreatePostModal />
        </div>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node,
};

export function SidebarItem({ icon, text, active, onClick, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      onClick={onClick}
      className={`relative flex items-center py-2 px-3 my-1 font-small rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-30 ml-1" : "w-0"}`}>
        {text}
      </span>
      {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}

SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  alert: PropTypes.bool,
};

SidebarItem.defaultProps = {
  active: false,
  onClick: () => {},
  alert: false,
};
