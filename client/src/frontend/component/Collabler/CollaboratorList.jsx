import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

function CollaboratorList({ onUserClick }) {  // Added onUserClick prop for consistency
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const decodedToken = jwtDecode(token);
      
      try {
        const response = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${decodedToken.id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
       
        const userInfo = response.data;
        setCollaborators(userInfo.user.collablers);
      } catch (error) {
        console.error("Error fetching collaborators:", error);
      }
    };

    fetchCollaborators();
  }, []);

  return (
    <div className="m-4">
      <h2 className="text-indigo-600">My Collaborators</h2>
      <div className="flex flex-wrap justify-start">
        {collaborators.map((collab) => (
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
