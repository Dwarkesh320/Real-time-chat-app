import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function ChatInput({ selectedChat }) {
  const [message, setMessage] = useState('');
  const [user] = useAuthState(auth);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedChat || !selectedChat.uid) {
      setError('Please select a user to chat with.');
      return;
    }

    if (message.trim() === '') return;

    const newMessage = {
        text: message,
        senderId:user.uid,
        receiverId: selectedChat.uid,
        timestamp: serverTimestamp(),

    };

    try {
        await addDoc(collection(db, 'messages'), newMessage);
        setMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to send message.');
      }
  };

  return (
    <form onSubmit={handleSend} className="chat-input">
      {error && <p className="chat-error">{error}</p>}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={selectedChat ? `Message ${selectedChat.displayName}` : 'Select a user to chat'}
        disabled={!selectedChat}
      />
      <button type="submit" disabled={!selectedChat || !message.trim()}>Send</button>
    </form>
  );
}

export default ChatInput;
