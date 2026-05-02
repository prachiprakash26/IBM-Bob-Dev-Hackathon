import React, { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import useChatHistory from '../hooks/useChatHistory';
import watsonService from '../services/watsonService';
import '../styles/ChatWindow.css';

/**
 * ChatWindow Component
 * Main chat interface container
 */
const ChatWindow = () => {
  const {
    messages,
    addMessage,
    clearHistory,
    getConversationHistory,
    isLoading,
    setIsLoading,
  } = useChatHistory();

  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Validate Watson configuration on mount
  useEffect(() => {
    try {
      watsonService.validateConfig();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /**
   * Handle sending a message to Watson
   */
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Clear any previous errors
    setError(null);

    // Add user message to chat
    addMessage(messageText, 'user');

    // Set loading state
    setIsLoading(true);

    try {
      // Get conversation history for context
      const history = getConversationHistory(5);

      // Send message to Watson and get response
      const response = await watsonService.sendMessage(messageText, history);

      // Add Watson's response to chat
      addMessage(response, 'assistant');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get response from Watson. Please try again.');
      
      // Add error message to chat
      addMessage(
        'Sorry, I encountered an error processing your request. Please try again.',
        'assistant'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle clearing chat history
   */
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      clearHistory();
      setError(null);
    }
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <h1 className="chat-title">Pride & Prejudice - AI Assistant</h1>
          <p className="chat-subtitle">Ask me anything about Jane Austen's classic novel</p>
        </div>
        {messages.length > 0 && (
          <button
            className="clear-history-button"
            onClick={handleClearHistory}
            aria-label="Clear chat history"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button
            className="error-close"
            onClick={() => setError(null)}
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div className="chat-messages" ref={chatContainerRef}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📖</div>
            <h2 className="empty-state-title">Welcome to Pride & Prejudice Assistant</h2>
            <p className="empty-state-text">
              Ask me anything about Jane Austen's beloved novel and I'll help you explore the story!
            </p>
            <div className="example-questions">
              <p className="example-questions-title">Try asking:</p>
              <ul className="example-questions-list">
                <li>"Who is Mr. Darcy and what is his role in the story?"</li>
                <li>"What are the main themes in Pride & Prejudice?"</li>
                <li>"Tell me about Elizabeth Bennet's character"</li>
                <li>"What happens at the Netherfield ball?"</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;

// Made with Bob
