import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

function CollaboratorList() {
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const decodedToken = jwtDecode(token);
      
      try {
        const userInfoResponse = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${decodedToken.id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
       
        const userInfo = userInfoResponse.data;
        console.log('====================================');
        console.log(userInfo.user.collablers.username);
        console.log('====================================');
        setCollaborators(userInfo.user.collablers);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUser();
  }, []);

  return (
    <div className="m-4">
      
        <h2 className="text-indigo-600">My Collaborators</h2>
       <div className="flex flex-wrap justify-start">
        {collaborators.map((collab, index) => (
          <UserCard 
            key={index} 
            user={collab} 
            type="collaborator" 
          />
        ))}
      </div>
    </div>
  );
}

export default CollaboratorList;
