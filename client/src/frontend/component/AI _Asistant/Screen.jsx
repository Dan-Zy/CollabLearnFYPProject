import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function Screen() {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI("AIzaSyAII2IrTfxL3J8KqZJwGg3lzSuwdvayKjc"); // Add your API key here

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

      // Add user's query to the promptResponses state
      setPromptResponses((prevResponses) => [...prevResponses, { content: inputValue, isUser: true }]);

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(inputValue);

      const responseText = await result.response.text();
 
      // Add AI's response to the promptResponses state
      setPromptResponses((prevResponses) => [...prevResponses, { content: responseText, isUser: false }]);

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

  return (
    <div className="flex-1 flex-col rounded-lg w-full">
      <div className="flex justify-center items-center text-center p-2 bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 text-[1vw]">
        <div className="font-semibold text-[1vw]">{'Your Helper'}</div>
        <div className="text-[1vw]">⋮</div>
      </div>
      <div className="flex flex-col flex-1 w-full h-[74vh] bg-gray-100 overflow-y-auto custom-scrollbar p-2">
        {loading ? (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          promptResponses.map((response, index) => (
            <div
              key={index}
              className={`flex my-1 p-2 rounded-xl max-w-[80%] text-[1vw] ${
                response.isUser
                  ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-500 ml-auto'
                  : 'bg-white text-gray-500 mr-auto'
              }`}
            >
              <div className="flex flex-col">
                <div className="mt-1">{renderResponseContent(response.content)}</div>
              </div>
            </div>
          ))
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
          className={`bg-blue-500 text-white text-[1vw] p-2 rounded-full ml-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Screen;
