import React from 'react';
import UserCard from './UserCard';

function SuggestedList({ users }) {
  return (
    <div className="m-4">
      <h2 className="text-indigo-600 mb-4">Suggested Collaborators</h2>
      <div className="flex flex-wrap justify-start">
        {users.map((user, index) => (
          <UserCard 
            key={index} 
            user={user} 
            type="suggested" 
          />
        ))}
      </div>
    </div>
  );
}

export default SuggestedList;
