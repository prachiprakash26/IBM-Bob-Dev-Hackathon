import { useState, useEffect, useCallback } from 'react';
import { saveMessages, loadMessages, clearMessages } from '../utils/storage';

/**
 * Custom hook for managing chat history with local storage persistence
 */
const useChatHistory = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from local storage on mount
  useEffect(() => {
    const loadedMessages = loadMessages();
    setMessages(loadedMessages);
  }, []);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  /**
   * Add a new message to the chat
   * @param {string} content - Message content
   * @param {string} role - Message role ('user' or 'assistant')
   */
  const addMessage = useCallback((content, role = 'user') => {
    const newMessage = {
      id: Date.now() + Math.random(), // Unique ID
      content,
      role,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  /**
   * Clear all messages from chat and storage
   */
  const clearHistory = useCallback(() => {
    setMessages([]);
    clearMessages();
  }, []);

  /**
   * Get conversation history in Watson API format
   * @param {number} limit - Maximum number of messages to include
   * @returns {Array} Array of messages in Watson format
   */
  const getConversationHistory = useCallback((limit = 10) => {
    return messages
      .slice(-limit)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
  }, [messages]);

  return {
    messages,
    addMessage,
    clearHistory,
    getConversationHistory,
    isLoading,
    setIsLoading,
  };
};

export default useChatHistory;

// Made with Bob
