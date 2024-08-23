import React from 'react';
import UserCard from './UserCard';

function SuggestedList({ users, onUserClick }) {
  return (
    <div className="m-4">
      <h2 className="text-indigo-600 mb-4">Suggested Collaborators</h2>
      <div className="flex flex-wrap justify-center">
        {users.map((user) => (
          <UserCard 
            key={user._id} 
            user={user} 
            type="suggested"  // Pass the type as "suggested"
            onUserClick={onUserClick}  // Pass the onUserClick prop
          />
        ))}
      </div>
    </div>
  );
}

export default SuggestedList;
