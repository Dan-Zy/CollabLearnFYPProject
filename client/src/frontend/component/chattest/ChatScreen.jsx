import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import img from '../../../assets/person_icon.png';

const socket = io('http://localhost:3001'); // Adjust the URL as needed

function ChatScreen({ chatId, username, chatUser }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Join chat room
    socket.emit('joinChat', chatId);

    // Handle incoming messages
    socket.on('message', (message) => {
      setMessages(messages => [...messages, message]);
    });

    // Fetch messages from backend
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `${token}`,
          },
          // Adding a unique query parameter to prevent caching
          params: {
            t: new Date().getTime(),
          },
        };
        const res = await axios.get(`http://localhost:3001/collablearn/get-messages/${chatId}`, config);
        setMessages(res.data || []);
        console.log('====================================');
        console.log(messages.length);
        console.log('====================================');
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();

    // Clean up on component unmount
    return () => {
      socket.off('message');
      socket.emit('leaveChat', chatId); // Optional: leave chat room on unmount
    };
  }, [chatId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      content: messageInput,
      chatId,
    };

    // Send message via Socket.io
    socket.emit('sendMessage', newMessage);

    // Send message to backend via Axios
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `${token}`,
        },
        // Adding a unique query parameter to prevent caching
        params: {
          t: new Date().getTime(),
        },
      };
      const response = await axios.post('http://localhost:3001/collablearn/send-message', newMessage, config);
      setMessages(messages => [...messages, response.data]);
    } catch (error) {
      alert('Error sending message', error);
    }

    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-2 bg-gray-200 border-b border-gray-300 text-[1vw]">
        <div className="cursor-pointer text-[1vw]">←</div>
        <div className="font-bold text-[1vw]">{username || 'Chat'}</div>
        <div className="text-[1vw]">⋮</div>
      </div>
      <div className="flex-1 w-full bg-gray-100 overflow-y-auto p-2">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={`my-1 p-2 rounded-xl max-w-full text-[1vw] ${message.sender._id === userId ? 'bg-blue-500 text-white ml-auto' : 'bg-white text-black'}`}>
              {message.content}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-[1vw]">No messages yet.</p>
        )}
      </div>
      <form className="flex justify-center items-center bg-gray-200 p-2" onSubmit={sendMessage}>
        <input
          type="text"
          className="flex-1 rounded-full text-[1vw] p-2 border-none outline-none"
          placeholder="Type message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white text-[1vw] p-2 rounded-full ml-2">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatScreen;
