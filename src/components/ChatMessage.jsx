  import React, { useEffect, useRef } from 'react';
  import '../styles/ChatMessage.css';
  import { BiCheckDouble } from "react-icons/bi";
  import { FaCheck } from "react-icons/fa6";

  function ChatMessages({ messages, currentUser }) {
    const messagesEndRef = useRef(null);
    
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (messages.length === 0) {
      return (
        <div className="chat-messages">
          <div className="no-messages">
            No messages yet. Start the conversation!
          </div>
        </div>
      );
    }

    return (
      <div className="chat-messages">
        {messages.map((message) => {
          const isSender = message.senderId === currentUser.uid;
          const messageTime = message.createdAt?.toDate().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          return (
            <div 
              key={message.id} 
              className={`message ${isSender ? 'sent' : 'received'}`}
            >
              {!isSender && (
                <div className="message-sender" style={{width:"60px"}}>{message.senderName}</div>
              )}
              <div className="message-content">
                <p >{message.text}</p>
                <p>{message.emoji}</p>
                <div className="message-meta">
                  <span className="message-time">{messageTime}</span>
                  {isSender && (
                    <span className="message-status">
                      {message.readAt ? <BiCheckDouble style={{color:"white"}} /> : message.sentAt ? <FaCheck /> : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    );
  }

  export default ChatMessages;