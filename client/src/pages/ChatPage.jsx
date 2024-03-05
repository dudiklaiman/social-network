import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      // Emit the message to the server
      socket.emit('message', {
        // sender: 'userId', // Replace with the actual user ID
        // chat: 'chatId',   // Replace with the actual chat ID
        content: message,
      });

      // Update the local messages immediately for a better user experience
      setMessages((prevMessages) => [...prevMessages, { content: message, sender: 'userId' }]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
