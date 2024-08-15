import React from 'react';
import UserCard from './UserCard';

function ReceivedRequestsList({ users }) {
  return (
    <div className="m-4">
      <h2 className="text-indigo-600 mb-4">Requests</h2>
      <div className="flex flex-wrap justify-start">
        {users.map((user) => (
          <UserCard 
            key={user._id} 
            user={user} 
            type="received" 
          />
        ))}
      </div>
    </div>
  );
}

export default ReceivedRequestsList;
