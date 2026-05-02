import React from 'react';
import '../styles/TypingIndicator.css';

/**
 * TypingIndicator Component
 * Displays animated dots to indicate Watson is processing
 */
const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-indicator-content">
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;

// Made with Bob
