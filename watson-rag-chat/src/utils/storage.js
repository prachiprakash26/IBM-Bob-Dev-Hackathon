/**
 * Local Storage Utility
 * Handles saving and loading chat history from browser's local storage
 */

const STORAGE_KEY = 'watson_chat_history';

/**
 * Save chat messages to local storage
 * @param {Array} messages - Array of message objects
 */
export const saveMessages = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages to local storage:', error);
  }
};

/**
 * Load chat messages from local storage
 * @returns {Array} Array of message objects or empty array
 */
export const loadMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading messages from local storage:', error);
    return [];
  }
};

/**
 * Clear all chat messages from local storage
 */
export const clearMessages = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing messages from local storage:', error);
  }
};

/**
 * Format timestamp for display
 * @param {Date|string|number} timestamp - Timestamp to format
 * @returns {string} Formatted time string
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Less than a minute ago
  if (diffInSeconds < 60) {
    return 'Just now';
  }

  // Less than an hour ago
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  }

  // Older
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Made with Bob
