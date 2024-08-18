import React, { useState, useEffect } from 'react';
import CollaboratorList from './CollaboratorList';
import SuggestedList from './SuggestedList';
import ReceivedRequestsList from './ReceivedRequestsList';
import OtherUserProfile from './otherUserProfile';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

function MainPageCollab() {
  // Retrieve the state from localStorage or default to 'MyCollaborator'
  const initialTab = localStorage.getItem('collab_activeTab') || 'MyCollaborator';
  const initialSelectedUserId = localStorage.getItem('collab_selectedUserId') || null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [receivedRequestUsers, setReceivedRequestUsers] = useState([]);
  const [collablers, setCollablers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(initialSelectedUserId);
  const [flash, setFlash] = useState(false);  // State to control flash effect

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
        !userInfo.user.collablers.includes(user._id.toString()) &&
        !userInfo.user.sendedRequests.includes(user._id.toString()) &&
        !userInfo.user.receivedRequests.some(req => req.user === user._id.toString())
      );

      setSuggestedUsers(filteredSuggestedUsers);

      const filteredReceivedReqUsers = allUsers.filter(user =>
        userInfo.user._id.toString() !== user._id.toString() &&
        userInfo.user.receivedRequests.some(req => req.user === user._id.toString())
      );

      setReceivedRequestUsers(filteredReceivedReqUsers);

      const filteredCollaborators = allUsers.filter(user =>
        userInfo.user.collablers.includes(user._id.toString())
      );

      setCollablers(filteredCollaborators);
    }
  }, [userInfo, allUsers]);

  const handleUserCardClick = (userId) => {
    setSelectedUserId(userId);
    localStorage.setItem('collab_selectedUserId', userId);  // Save to localStorage
  };

  const handleGoBack = () => {
    setSelectedUserId(null);
    localStorage.removeItem('collab_selectedUserId');  // Clear selected user from localStorage
  };

  const triggerFlashEffect = (callback) => {
    setFlash(true);
    setTimeout(() => {
      callback();
      setFlash(false);
    }, 500); // Duration of flash effect
  };

  const handleDataUpdate = () => {
    triggerFlashEffect(() => {
      // Re-fetch data or update state here to reflect the change
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
    });
  };

  const renderContent = () => {
    if (selectedUserId) {
      let userType;
      switch (activeTab) {
        case 'MyCollaborator':
          userType = 'collaborator';
          break;
        case 'Requested':
          userType = 'received';
          break;
        case 'Suggested':
          userType = 'suggested';
          break;
        default:
          userType = null;
      }

      return (
        <OtherUserProfile 
          userId={selectedUserId} 
          type={userType} 
          onActionComplete={handleDataUpdate} 
          onGoBack={handleGoBack} // Pass handleGoBack function
        />
      );
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
    setSelectedUserId(null);
    localStorage.setItem('collab_activeTab', tabName);  // Save active tab to localStorage
    localStorage.removeItem('collab_selectedUserId');  // Clear selected user when tab changes
  };

  return (
    <div className={`m-4 ${flash ? 'animate-flash' : ''}`}>
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
