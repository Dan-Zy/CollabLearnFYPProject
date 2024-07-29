import React, { useEffect, useState } from 'react';
import axios from 'axios';
import img from '../../../assets/person_icon.png';
import ChatScreen from './ChatScreen';

export function ChatBox() {
  const [chatBoxData, setChatBoxData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
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

        // Assuming the backend returns an object with a "chats" property
        setChatBoxData(data.chats || []);
      } catch (error) {
        console.error('Error fetching chats', error);
      }
    };

    fetchChats();
  }, []);

  return (
    <>
      {selectedChat ? (
        <ChatScreen 
          chatId={selectedChat._id}
          username={selectedChat.users.find(user => user._id !== localStorage.getItem('userId')).username} 
          chatUser={selectedChat.users.find(user => user._id !== localStorage.getItem('userId'))._id}
        />
      ) : (
        chatBoxData.map((chat, index) => (
          <div
            key={index}
            className="flex justify-center border-b-2 p-1 border-indigo-100 items-center cursor-pointer"
            onClick={() => setSelectedChat(chat)}
          >
            <img
              src={`http://localhost:3001/${chat.users[0].profilePicture}` || img}
              alt={chat.name}
              className="flex rounded-full w-12 h-12 mr-3 border border-indigo-500 p-2"
            />
            <div>
              <h4 className="flex text-sm font-semibold">{chat.users[0].username || 'Unnamed Chat'}</h4>
              <p className="flex text-sm text-gray-500">
                {chat.isGroupChat ? 'Group Chat' : 'Personal Chat'}
              </p>
            </div>
          </div>
        ))
      )}
    </>
  );
}
