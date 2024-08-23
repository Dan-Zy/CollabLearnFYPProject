import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from '../Collabler/UserCard'; // Ensure this path is correct

export function People({ query }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`http://localhost:3001/collablearn/user/getUsers`, {
          headers: {
            Authorization: `${token}`
          }
        });
       
        const filteredUsers = response.data.data.filter(user =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.role.toLowerCase().includes(query.toLowerCase())
        );

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div className="">
      {users.map((user) => (
        <UserCard key={user.id} user={user} type = {"friend"} />
      ))}
    </div>
  );
}

export default People;
