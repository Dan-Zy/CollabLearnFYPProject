import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ onSearchInputChange }) => {
  const handleInputChange = (e) => {
    onSearchInputChange(e.target.value);
  };

  return (
    <header className="flex flex-auto items-center justify-between p-2 bg-gray-100 shadow-md">
      <div className="flex items-center w-2/3 md:w-3/4 lg:w-1/2 bg-white rounded-full shadow-sm">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 px-4 py-2 bg-transparent rounded-full focus:outline-none"
          onChange={handleInputChange} // Add onChange handler
        />
      </div>
      <button className="ml-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none">
        <Bell className="text-gray-600" />
      </button>
    </header>
  );
};

export default Header;
