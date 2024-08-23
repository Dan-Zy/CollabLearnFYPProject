import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from '../Collabler/UserCard'; // Ensure this path is correct
import jwtDecode from 'jwt-decode';
import OtherUserProfile from '../Collabler/otherUserProfile'; // Import the profile component

export function People({ query }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // State to manage selected user
  const [selectedUserType, setSelectedUserType] = useState(null); // State to manage selected user type

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const decodedToken = jwtDecode(token);

        const userInfoResponse = await axios.get(
          `http://localhost:3001/collablearn/user/getUser/${decodedToken.id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const currentUser = userInfoResponse.data.user;
        setUserInfo(currentUser);

        const response = await axios.get(`http://localhost:3001/collablearn/user/getUsers`, {
          headers: {
            Authorization: `${token}`,
          }
        });

        const filteredUsers = response.data.data
          .filter(user =>
            user._id !== currentUser._id && 
            (user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.role.toLowerCase().includes(query.toLowerCase()))
          )
          .map(user => {
            let userType = '';

            if (currentUser.collablers.includes(user._id.toString())) {
              userType = 'collaborator';
            } else if (currentUser.receivedRequests.some(req => req.user === user._id.toString())) {
              userType = 'received';
            } else {
              userType = 'suggested';
            }

            return { ...user, userType };
          });

        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  const handleUserCardClick = (userId, userType) => {
    setSelectedUserId(userId);
    setSelectedUserType(userType);
  };

  const handleGoBack = () => {
    setSelectedUserId(null);
    setSelectedUserType(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (selectedUserId) {
    return (
      <OtherUserProfile 
        userId={selectedUserId} 
        type={selectedUserType} 
        onGoBack={handleGoBack} 
      />
    );
  }

  if (users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      {users.map((user) => (
        <UserCard 
          key={user._id} // Use _id since it's consistent with MongoDB object IDs
          user={user} 
          type={user.userType} 
          onUserClick={handleUserCardClick} // Pass the click handler
        />
      ))}
    </div>
  );
}

export default People;
