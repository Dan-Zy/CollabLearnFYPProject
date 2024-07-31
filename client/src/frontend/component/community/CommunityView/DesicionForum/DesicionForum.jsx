import React, { useState } from 'react';

function DesicionForum() {
  const [messages, setMessages] = useState([]);

  const receiveDummyMessage = () => {
    const dummyResponse = "Welcome to CollabLearn Platform";
    const newMessage = {
      text: dummyResponse,
      timestamp: new Date().toLocaleTimeString(),
      isUser: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const messageText = event.target.elements.messageInput.value;
    if (messageText.trim()) {
      const newMessage = {
        text: messageText,
        timestamp: new Date().toLocaleTimeString(),
        isUser: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      event.target.elements.messageInput.value = ''; // Clear input field

      setTimeout(receiveDummyMessage, 5000);
    }
  };

  const ChatMessage = ({ text, timestamp, isUser }) => {
    const messageClass = isUser ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 ml-auto' : 'bg-white text-gray-500 mr-auto';
    return (
      <div className={`my-1 p-2 rounded-xl max-w-[80%] text-[1vw] ${messageClass}`}>
        <div className="p-2 rounded-lg max-w-[60%] mb-1 text-center">{text}</div>
        <div className="text-xs text-gray-500 text-center">{timestamp}</div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col h-screen">
      <div className="flex justify-between items-center p-2 bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 text-[1vw]">
        <h1 className="text-xl">Header</h1>
      </div>
      <div className="flex-grow flex flex-col justify-between h-full border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex flex-col p-2 overflow-y-auto h-full">
          {messages.map((message, index) => (
            <ChatMessage key={index} {...message} />
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center justify-center p-2 border-t border-gray-300 bg-white">
          <input
            type="text"
            name="messageInput"
            className="flex-1 border border-blue-600 rounded-full mr-2 h-10 text-center"
            placeholder="Type message…"
            autoComplete="off"
          />
          <button type="submit" className="bg-blue-600 text-white rounded-full h-12 px-4 cursor-pointer">Send</button>
        </form>
      </div>
    </div>
  );
}

export default DesicionForum;
