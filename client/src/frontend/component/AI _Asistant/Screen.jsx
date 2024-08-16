import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function Screen() {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI("AIzaSyAII2IrTfxL3J8KqZJwGg3lzSuwdvayKjc"); // Add your API key here

  // Function to check if messages are older than 30 minutes
  const isMessageExpired = (timestamp) => {
    const THIRTY_MINUTES = 30 * 60 * 1000;
    return Date.now() - timestamp > THIRTY_MINUTES;
  };

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('promptResponses')) || [];
    const filteredMessages = storedMessages.filter(message => !isMessageExpired(message.timestamp));
    setPromptResponses(filteredMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to get response from Google Gemini API
  const getResponseForGivenPrompt = async () => {
    try {
      setLoading(true);

      const userMessage = {
        content: inputValue,
        isUser: true,
        timestamp: Date.now(),
      };

      setPromptResponses((prevResponses) => {
        const updatedResponses = [...prevResponses, userMessage];

        // Limit the stored messages to 20
        if (updatedResponses.length > 20) {
          updatedResponses.shift(); // Remove the oldest message
        }

        // Save to localStorage
        localStorage.setItem('promptResponses', JSON.stringify(updatedResponses));
        return updatedResponses;
      });

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(inputValue);

      const responseText = await result.response.text();

      const aiMessage = {
        content: responseText,
        isUser: false,
        timestamp: Date.now(),
      };

      setPromptResponses((prevResponses) => {
        const updatedResponses = [...prevResponses, aiMessage];

        // Limit the stored messages to 20
        if (updatedResponses.length > 20) {
          updatedResponses.shift(); // Remove the oldest message
        }

        // Save to localStorage
        localStorage.setItem('promptResponses', JSON.stringify(updatedResponses));
        return updatedResponses;
      });

      setInputValue('');
      setLoading(false);
      scrollToBottom();
    } catch (error) {
      console.error("Something went wrong:", error);
      setLoading(false);
    }
  };

  const renderResponseContent = (content) => {
    if (!content || typeof content !== 'string') {
      return null; // or return an empty string or a placeholder
    }

    const lines = content.split('\n').filter(line => line.trim() !== '');

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      const formattedLine = trimmedLine.replace(/^\s*[-*]\s*/, '');

      return (
        <p key={index} className="mb-2 text-left">
          {formattedLine}
        </p>
      );
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [promptResponses]);

  return (
    <div className="flex-1 flex-col rounded-lg w-full">
      <div className="flex flex-col flex-1 w-full h-[78vh] bg-gray-100 overflow-y-auto custom-scrollbar p-2 relative">
        {promptResponses.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src="https://th.bing.com/th/id/R.17f68e401b36b8b87346557940a40970?rik=z577NYQCAla5qQ&pid=ImgRaw&r=0" // Replace with your robotic image URL
              alt="Robotic Assistant"
              className="w-24 h-24 mb-4"
            />
            <p className="text-gray-600 text-lg">Hello! How can I assist you today?</p>
          </div>
        )}
        {promptResponses.map((response, index) => (
          <div
            key={index}
            className={`flex my-1 p-2 rounded-xl max-w-[80%] text-[1vw] ${
              response.isUser
                ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 ml-auto'
                : 'bg-white text-gray-500 mr-auto flex items-start'
            }`}
          >
            {!response.isUser && (
              <img
                src="https://th.bing.com/th/id/R.17f68e401b36b8b87346557940a40970?rik=z577NYQCAla5qQ&pid=ImgRaw&r=0" // Replace with your robotic image URL
                alt="Robotic Assistant"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div className="flex flex-col">
              <div className="mt-1">{renderResponseContent(response.content)}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex my-1 p-2 rounded-xl max-w-[80%] bg-white text-gray-500 mr-auto">
            <div className="flex flex-col">
              <div className="text-center mt-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex justify-center items-center bg-gray-200 p-2" onSubmit={(e) => { e.preventDefault(); getResponseForGivenPrompt(); }}>
        <input
          type="text"
          className="flex-1 rounded-full text-[1vw] p-2 border-none outline-none"
          placeholder="Ask me something you want"
          value={inputValue}
          onChange={handleInputChange}
          disabled={loading}
        />
        <button
          type="submit"
          className={`bg-indigo-500 text-white text-[1vw] p-2 rounded-full ml-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          Ask
        </button>
      </form>
    </div>
  );
}

export default Screen;
