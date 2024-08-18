import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function About({ communityId }) {

  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    communityName: '',
    communityDescription: '',
    communityBanner: null,
    privacy: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/collablearn/getCommunity/${communityId}`, {
          headers: {
            'Authorization': `${token}`
          }
        });
        setCommunity(response.data.community);
        setIsAdmin(response.data.community.adminId._id === JSON.parse(localStorage.getItem('userInfo'))._id);
        setFormData({
          communityName: response.data.community.communityName,
          communityDescription: response.data.community.communityDescription,
          privacy: response.data.community.privacy,
        });
      } catch (error) {
        console.error('Error fetching community', error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/collablearn/getCommunityMembers/${communityId}`, {
          headers: {
            'Authorization': `${token}`
          }
        });
        setMembers(response.data.members);
      } catch (error) {
        console.error('Error fetching members', error);
      }
    };

    fetchCommunity();
    fetchMembers();
  }, [communityId]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleRemoveMember = async (memberId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:3001/collablearn/removeMemberFromCommunity/${communityId}/${memberId}`, {}, {
        headers: {
          'Authorization': `${token}`
        }
      });
      
      if (response.data.success) {
        toast.success('Member removed successfully!');
        setMembers(members.filter(member => member._id !== memberId)); // Update the members list
      } else {
        toast.error('Failed to remove member.');
      }
    } catch (error) {
      console.error('Error removing member', error);
      toast.error('An error occurred while removing the member.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    
    formDataToSend.append('communityName', formData.communityName);
    formDataToSend.append('communityDescription', formData.communityDescription);
    formDataToSend.append('privacy', formData.privacy);
    if (formData.communityBanner) {
      formDataToSend.append('image', formData.communityBanner);
    }

    try {
      const response = await axios.put(`http://localhost:3001/collablearn/updateCommunity/${communityId}`, formDataToSend, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      // Update the community state immediately after successful update
      setCommunity(response.data.community);
      setEditing(false);
    } catch (error) {
      console.error('Error updating community', error);
    }
  };

  if (!community) {
    return <div className="flex justify-center items-center h-screen">
      <div className="loader"></div>
    </div>;
  }

  return (
    <div className="w-full flex flex-col p-6 bg-gray-50">
      <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-600">About</h2>
        {!editing ? (
          <>
            <p className="text-gray-700 mt-4">{community.communityDescription}</p>
            {isAdmin && (
              <button onClick={() => setEditing(true)} className="bg-indigo-500 text-white p-2 rounded mt-4 hover:bg-indigo-600">Edit</button>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Community Name</label>
              <input
                type="text"
                name="communityName"
                value={formData.communityName}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Community Description</label>
              <textarea
                name="communityDescription"
                value={formData.communityDescription}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Privacy</label>
              <select
                name="privacy"
                value={formData.privacy}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Community Banner</label>
              <input
                type="file"
                name="communityBanner"
                onChange={handleInputChange}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-500 text-white p-2 rounded">Save</button>
              <button onClick={() => setEditing(false)} className="bg-gray-300 text-black p-2 rounded ml-2">Cancel</button>
            </div>
          </form>
        )}
      </div>
      
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-600">Members</h2>
        <ul className="mt-4">
          {members.map(member => (
            <li key={member._id} className="flex mb-4 justify-between items-center bg-gray-100 p-2 rounded-lg">
              <div className="flex items-center">
                <img 
                  src={member.profilePicture ? `http://localhost:3001/${member.profilePicture}` : "https://via.placeholder.com/40"} 
                  alt={`${member.username}'s profile`} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="text-gray-800">{member.username}</span>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => handleRemoveMember(member._id)} 
                  className="bg-red-200 p-2 text-red-700 hover:bg-red-300 rounded-lg"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
}

export default About;
