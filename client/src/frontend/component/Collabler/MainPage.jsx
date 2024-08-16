import React, { useState, useEffect } from 'react';
import CollaboratorList from './CollaboratorList';
import SuggestedList from './SuggestedList';
import ReceivedRequestsList from './ReceivedRequestsList';
import OtherUserProfile from './otherUserProfile';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

function MainPageCollab() {
  const [activeTab, setActiveTab] = useState('MyCollaborator');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [receivedRequestUsers, setReceivedRequestUsers] = useState([]);
  const [collablers, setCollablers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // New state for selected user

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found');
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

        setUserInfo(userInfoResponse.data);

        const allUsersResponse = await axios.get(`http://localhost:3001/collablearn/user/getUsers`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setAllUsers(allUsersResponse.data.data);

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userInfo && allUsers.length > 0) {
      const filteredSuggestedUsers = allUsers.filter(user =>
        userInfo.user._id.toString() !== user._id.toString() &&
        !userInfo.user.collablers.includes(user._id.toString())&&
        !userInfo.user.sendedRequests.includes(user._id.toString()) &&
        !userInfo.user.receivedRequests.some(req => req.user === user._id.toString())
      );
  
      setSuggestedUsers(filteredSuggestedUsers);
  
      const filteredReceivedReqUsers = allUsers.filter(user =>
        userInfo.user._id.toString() !== user._id.toString() &&
        userInfo.user.receivedRequests.some(req => req.user === user._id.toString())
      );
  
      setReceivedRequestUsers(filteredReceivedReqUsers);
  
      const filteredCollablers = allUsers.filter(user =>
        userInfo.user._id.toString() !== user._id.toString() &&
        userInfo.user.collablers.includes(user._id.toString())
      );

      setCollablers(filteredCollablers);
    }
  }, [userInfo, allUsers]);

  const handleUserCardClick = (userId) => {
    setSelectedUserId(userId);
  };

  const renderContent = () => {
    if (selectedUserId) {
      
      return <OtherUserProfile userId={selectedUserId} />;

    }

    switch (activeTab) {
      case 'MyCollaborator':
        return <CollaboratorList users={collablers} onUserClick={handleUserCardClick} />;
      case 'Requested':
        return <ReceivedRequestsList users={receivedRequestUsers} onUserClick={handleUserCardClick} />;
      case 'Suggested':
        return <SuggestedList users={suggestedUsers} onUserClick={handleUserCardClick} />;
      default:
        return null;
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSelectedUserId(null); // Reset to main view when switching tabs
  };

  return (
    <div className="m-4">
      {!selectedUserId && (
        <div className="flex justify-around mb-4">
          <p
            className={`px-4 py-2 ${activeTab === 'MyCollaborator' ? 'text-indigo-500 border-b-2 text-sm border-indigo-500' : 'text-xs'}`}
            onClick={() => handleTabClick('MyCollaborator')}
          >
            My Collaborator
          </p>
          <p
            className={`px-4 py-2 ${activeTab === 'Requested' ? 'text-indigo-500 border-b-2 text-sm border-indigo-500' : 'text-xs'}`}
            onClick={() => handleTabClick('Requested')}
          >
            Requested
          </p>
          <p
            className={`px-4 py-2 ${activeTab === 'Suggested' ? 'text-indigo-500 border-b-2 text-sm border-indigo-500' : 'text-xs'}`}
            onClick={() => handleTabClick('Suggested')}
          >
            Suggested
          </p>
        </div>
      )}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

export default MainPageCollab;
