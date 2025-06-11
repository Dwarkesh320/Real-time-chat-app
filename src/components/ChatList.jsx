import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/ChatList.css';

function ChatList({ currentUser, setActiveChat, messages, user }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const chatData = doc.data();
          const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
          
          // Get the other user's details
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          const userData = userDoc.data() || { displayName: 'Unknown User' };
          
          return {
            id: doc.id,
            lastMessage: chatData.lastMessage || null,
            user: {
              uid: otherUserId,
              displayName: userData.displayName,
              photoURL: userData.photoURL
            },
            updatedAt: chatData.updatedAt?.toDate() || new Date()
          };
        })
      );
      
      // Sort chats by most recent
      chatsData.sort((a, b) => b.updatedAt - a.updatedAt);
      setChats(chatsData);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="chats-container">
      {loading ? (
        <p>loading chats.....</p>
      ) : chats.length === 0 ? (
        <p>No conversations yet. Start chatting!</p>
      ) : (
        <ul className="chats-list">
          {chats.map((chat) => (
            <li 
              key={chat.id} 
              className="chat-item"
              onClick={() => setActiveChat({ user: chat.user })}
            >
              <div className="chat-avatar">
                {chat.user.photoURL ? (
                  <img src={chat.user.photoURL} alt={chat.user.displayName} />
                ) : (
                  <div className="avatar-placeholder">
                    {chat.user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="chat-info">
                <h3>{chat.user.displayName}</h3>
                {chat.lastMessage ? (
                  <p className="last-message">
                    {chat.lastMessage.senderId === currentUser.uid ? 'You: ' : ''}
                    {chat.lastMessage.text}
                  </p>
                ) : (
                  <p className="no-messages">No messages yet</p>
                )}
              </div>
              {chat.lastMessage && (
                <div className="timestamp">
                  {chat.lastMessage.timestamp?.toDate().toLocaleTimeString([], {
                    hour: '2-digit', 
                    minute:'2-digit'
                  })}
                  <ChatMessages messages={messages} currentUser={user} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatList;