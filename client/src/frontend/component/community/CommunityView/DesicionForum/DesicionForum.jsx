import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Adjust the URL as needed

function DesicionForum({ communityId }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatId, setChatId] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?._id;
  const messagesEndRef = useRef(null);

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
          const chat = data.chats.find(chat => chat.chatName === communityId);
          if (chat) {
            setChatId(chat._id);
          } else {
            console.error('Chat not found for the given communityId');
          }
        } else {
          console.error('Unexpected data format', data);
        }
      } catch (error) {
        console.error('Error fetching chats', error);
      }
    };

    fetchChats();
  }, [communityId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
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
      }
    };

    if (chatId) {
      socket.emit('joinChat', chatId);

      // Handle incoming messages
      socket.on('message received', (message) => {
        setMessages((messages) => [...messages, message]);
        scrollToBottom();
      });

      // Fetch messages periodically
      const intervalId = setInterval(fetchMessages, 1000);

      // Clean up on component unmount
      return () => {
        clearInterval(intervalId);
        socket.off('message received');
        socket.emit('leaveChat', chatId); // Optional: leave chat room on unmount
      };
    }
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
      await axios.post('http://localhost:3001/collablearn/send-message', newMessage, config);
      setMessageInput('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex-col rounded-lg w-full">
      <div className="flex justify-center items-center text-center p-2 bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 text-[1vw]">
        <div className=" font-semibold text-[1vw]">{'Ask your Queries'}</div>
        <div className="text-[1vw]">⋮</div>
      </div>
      <div className="flex flex-col flex-1 w-full h-[58vh] bg-gray-100 overflow-y-auto custom-scrollbar p-2">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={`flex my-1 p-2 rounded-xl max-w-[80%] text-[1vw] ${message.sender._id === userId ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 ml-auto' : 'bg-white text-gray-500 mr-auto'}`}>
              {message.sender._id !== userId && (
                <img
                  src={message.sender?.profilePicture ? `http://localhost:3001/${message.sender?.profilePicture}` : 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-indigo-600 mr-2"
                />
              )}
              <div className='flex flex-col'>
              <div className='mt-1'>{message.content}</div>
              <p className='font-extralight text-[7px] '>{message.createdAt}</p>
              </div>
              
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

export default DesicionForum;
