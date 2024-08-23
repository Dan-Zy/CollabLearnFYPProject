import React from 'react';
import UserCard from './UserCard';

function CollaboratorList({ users, onUserClick }) {  // Receive filtered users as a prop
  return (
    <div className="m-4">
      <h2 className="text-indigo-600">My Collaborators</h2>
      <div className="flex  flex-wrap justify-center">
        {users.map((collab) => (
          <UserCard 
            key={collab._id} 
            user={collab} 
            type="collaborator"  // Pass the type as "collaborator"
            onUserClick={onUserClick}  // Pass the onUserClick prop
          />
        ))}
      </div>
    </div>
  );
}

export default CollaboratorList;
