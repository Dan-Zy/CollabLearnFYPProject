import React, { useEffect, useState } from 'react';
import axios from 'axios';
import img from '../../../assets/person_icon.png';
import ChatScreen from './ChatScreen';

export function ChatBox() {
  const [chatBoxData, setChatBoxData] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?._id;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const config = {
          headers: {
            Authorization: `${token}`,
          },
        };

        const { data } = await axios.get(
          'http://localhost:3001/collablearn/fetch-chats',
          config
        );

        if (data && Array.isArray(data.chats)) {
          setChatBoxData(data.chats.filter(chat => !chat.isGroupChat) || []);
        } else {
          console.error('Unexpected data format', data);
        }
      } catch (error) {
        console.error('Error fetching chats', error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const config = {
          headers: {
            Authorization: `${token}`,
          },
        };

        const { data } = await axios.get(
          'http://localhost:3001/collablearn/user/getUsers',
          config
        );

        if (data && Array.isArray(data.data)) {
          setAllUser(data.data || []);
        } else {
          console.error('Unexpected data format', data);
        }
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchChats();
    fetchAllUsers();
  }, []);

  const filteredUsers = allUser.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChats = chatBoxData.filter(chat => {
    if (!chat.users || chat.isGroupChat) return false;
    const otherUser = chat.users.find(user => user._id !== userId);
    return otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const displayData = searchTerm ? filteredUsers : filteredChats;

  const handleUserClick = async (user) => {
    console.log('User clicked:', user); // Debug statement

    let existingChat = chatBoxData.find(chat => {
      return chat.users && chat.users.some(chatUser => chatUser._id === user._id);
    });

    if (existingChat) {
      console.log('Existing chat found:', existingChat); // Debug statement
      setSelectedChat(existingChat);
    } else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const config = {
          headers: {
            Authorization: `${token}`,
          },
        };

        const { data } = await axios.post(
          'http://localhost:3001/collablearn/access-chat',
          { userId: user._id },
          config
        );
          
        if (data ) {

          setSelectedChat(data);
          
        } else {
          console.error('Unexpected response format', data);
        }
      } catch (error) {
        console.error('Error creating chat', error);
      }
    }
  };

  const handleBackClick = () => {
    setSelectedChat(null);
    setSearchTerm(''); // Reset search term
  };


  useEffect(() => {
    console.log('Selected chat updated:', selectedChat); // Debug statement
  }, [selectedChat]);

  return (
    <div>
      {!selectedChat && (
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />
      )}
      {selectedChat ? (
        <ChatScreen
          chatId={selectedChat._id}
          username={selectedChat.users?.find(user => user._id !== userId)?.username}
          chatUser={selectedChat.users?.find(user => user._id !== userId)?._id}
          onBack={handleBackClick} // Change to 'onBack' to match prop name
        />
      ) : (
        displayData.map((item, index) => {
          const otherUser = item.users ? item.users.find(user => user._id !== userId) : item;
          return (
            <div
              key={index}
              className="flex justify-start border-b-2 p-1 border-indigo-100 items-center cursor-pointer"
              onClick={() => {
                if (item.users) {
                  console.log('Selecting existing chat:', item); // Debug statement
                  setSelectedChat(item);
                } else {
                  console.log('Selecting user from search:', item); // Debug statement
                  handleUserClick(item);
                }
              }}
            >
              <img
                src={otherUser?.profilePicture ? `http://localhost:3001/${otherUser.profilePicture}` : img}
                alt={otherUser?.username || 'Chat User'}
                className="flex rounded-full w-12 h-12 mr-3 border border-indigo-500 p-1"
              />
              <div>
                <h4 className="flex text-sm font-semibold">{otherUser?.username || 'Unnamed Chat'}</h4>
                <p className="flex text-sm text-gray-500">
                  Personal Chat
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ChatBox;
