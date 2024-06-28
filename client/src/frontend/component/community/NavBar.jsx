import React from 'react';

export function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center">
      <button
        className={`btn-join ${activeTab === 'joined' ? 'active border-b-indigo-500 py-2 text-indigo-500' : ''}`}
        onClick={() => setActiveTab('joined')}
      >
        Joined
      </button>
      <button
        className={`btn-sug ml-4 ${activeTab === 'suggested' ? 'active border-b-indigo-500 py-2 text-indigo-500' : ''}`}
        onClick={() => setActiveTab('suggested')}
      >
        Suggested
      </button>
    </div>
  );
}
