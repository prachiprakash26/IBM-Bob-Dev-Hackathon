/**
 * Watson RAG Service
 * Communicates with backend proxy server to avoid CORS issues
 */

class WatsonService {
  constructor() {
    // Use proxy server for local dev, /api for production
    this.proxyUrl = process.env.REACT_APP_PROXY_URL ||
                    (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');
  }

  /**
   * Send a message to Watson RAG via proxy server
   * @param {string} message - User message
   * @param {Array} conversationHistory - Previous messages for context
   */
  async sendMessage(message, conversationHistory = []) {
    try {
      // Build messages array with conversation history
      const messages = [
        ...conversationHistory,
        {
          role: 'user',
          content: message,
        },
      ];

      const response = await fetch(`${this.proxyUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Proxy server error:', errorData);
        throw new Error(
          errorData.error || `Request failed: ${response.statusText}`
        );
      }

      // Parse the response
      const data = await response.json();

      // Extract the assistant's response from various possible formats
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else if (data.results && data.results.length > 0) {
        return data.results[0].generated_text;
      } else if (data.generated_text) {
        return data.generated_text;
      } else if (data.content) {
        return data.content;
      } else {
        // Log unexpected structure and return formatted response
        console.log('Unexpected response structure:', data);
        return JSON.stringify(data, null, 2);
      }
    } catch (error) {
      console.error('Error sending message to Watson:', error);
      
      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error(
          'Cannot connect to server. Make sure the proxy server is running on port 3001.'
        );
      }
      
      throw error;
    }
  }

  /**
   * Check if proxy server is running
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.proxyUrl}/api/health`);
      if (response.ok) {
        return await response.json();
      }
      return { status: 'error', message: 'Health check failed' };
    } catch (error) {
      return {
        status: 'error',
        message: 'Proxy server not reachable. Make sure it is running.'
      };
    }
  }

  /**
   * Validate configuration
   */
  validateConfig() {
    // Configuration is now handled by the proxy server
    // Just check if proxy URL is set
    if (!this.proxyUrl) {
      throw new Error('Proxy server URL not configured');
    }
    return true;
  }
}

// Export singleton instance
const watsonService = new WatsonService();
export default watsonService;

// Made with Bob
