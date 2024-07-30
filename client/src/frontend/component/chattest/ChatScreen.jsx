import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import img from '../../../assets/person_icon.png';

const socket = io('http://localhost:3000'); // Adjust the URL as needed

function ChatScreen({ chatId, username, chatUser, onBack }) { // Ensure the prop name matches
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?._id;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('joinChat', chatId);

    // Handle incoming messages
    socket.on('message received', (message) => {
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
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();

    // Clean up on component unmount
    return () => {
      socket.off('message received');
      socket.emit('leaveChat', chatId); // Optional: leave chat room on unmount
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!messageInput.trim()) return;

    setIsSending(true);

    const newMessage = {
      content: messageInput,
      chatId,
    };

    // Send message via Socket.io
    socket.emit('new message', newMessage);

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
      setMessageInput('');
      scrollToBottom();
    } catch (error) {
      alert('Error sending message', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex-col rounded-lg">
      <div className="flex justify-between items-center p-2 bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 text-[1vw]">
        <div className="cursor-pointer text-[1vw]" onClick={onBack}>←</div> {/* onClick handler */}
        <div className="font-semibold text-[1vw]">{username || 'Chat'}</div>
        <div className="text-[1vw]">⋮</div>
      </div>
      <div className="flex flex-col flex-1 w-full h-[58vh] bg-gray-100 overflow-y-auto custom-scrollbar p-2">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={`my-1 p-2 rounded-xl max-w-[80%] text-[1vw] ${message.sender._id === userId ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 ml-auto' : 'bg-white text-gray-500 mr-auto'}`}>
              {message.content}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-[1vw]">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex justify-center items-center bg-gray-200 p-2" onSubmit={sendMessage}>
        <input
          type="text"
          className="flex-1 rounded-full text-[1vw] p-2 border-none outline-none"
          placeholder="Type message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          disabled={isSending}
        />
        <button type="submit" className={`bg-blue-500 text-white text-[1vw] p-2 rounded-full ml-2 ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSending}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatScreen;
