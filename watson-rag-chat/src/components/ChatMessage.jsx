import React from 'react';
import { formatTimestamp } from '../utils/storage';
import '../styles/ChatMessage.css';

/**
 * ChatMessage Component
 * Displays a single chat message with timestamp
 * @param {Object} props
 * @param {Object} props.message - Message object containing id, content, role, timestamp
 */
const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const messageClass = isUser ? 'chat-message user-message' : 'chat-message assistant-message';

  return (
    <div className={messageClass}>
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {isUser ? 'You' : 'Watson Assistant'}
          </span>
          <span className="message-timestamp">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div className="message-text">{message.content}</div>
      </div>
    </div>
  );
};

export default ChatMessage;

// Made with Bob
