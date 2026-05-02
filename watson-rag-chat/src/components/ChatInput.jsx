import React, { useState } from 'react';
import '../styles/ChatInput.css';

/**
 * ChatInput Component
 * Handles user input and message submission
 * @param {Object} props
 * @param {Function} props.onSendMessage - Callback function when message is sent
 * @param {boolean} props.disabled - Whether input is disabled (e.g., while loading)
 */
const ChatInput = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !disabled) {
      onSendMessage(trimmedValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <div className="chat-input-container">
        <textarea
          className="chat-input-field"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about the book..."
          disabled={disabled}
          rows="1"
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={disabled || !inputValue.trim()}
          aria-label="Send message"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;

// Made with Bob
