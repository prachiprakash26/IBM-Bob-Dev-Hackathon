/**
 * Vercel Serverless Function for Watson API
 * This replaces server.js for serverless deployment
 */

const fetch = require('node-fetch');

// Cache token in memory (persists during function warm state)
let cachedToken = null;
let tokenExpiry = null;

/**
 * Get Watson authentication token
 */
async function getWatsonToken() {
  const API_KEY = process.env.REACT_APP_WATSON_API_KEY;
  const TOKEN_URL = process.env.REACT_APP_WATSON_TOKEN_URL;

  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: API_KEY,
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Authentication failed: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + 50 * 60 * 1000; // 50 minutes

    return cachedToken;
  } catch (error) {
    console.error('Error getting Watson token:', error.message);
    throw error;
  }
}

/**
 * Serverless function handler
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    // Get authentication token
    const token = await getWatsonToken();

    // Call Watson API
    const WATSON_API_URL = process.env.REACT_APP_WATSON_API_URL;
    const WATSON_DEPLOYMENT_ID = process.env.REACT_APP_WATSON_DEPLOYMENT_ID;
    
    const watsonUrl = `${WATSON_API_URL}/deployments/${WATSON_DEPLOYMENT_ID}/ai_service_stream?version=2021-05-01`;

    const response = await fetch(watsonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Watson API error:', errorText);
      return res.status(response.status).json({
        error: `Watson API request failed: ${response.statusText}`,
        details: errorText,
      });
    }

    // Parse streaming response
    const responseText = await response.text();
    let assistantResponse = '';

    try {
      const lines = responseText.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonData = line.substring(6);
          if (jsonData.trim() && jsonData !== '[DONE]') {
            try {
              const parsed = JSON.parse(jsonData);
              if (parsed.choices && parsed.choices[0]?.delta?.content) {
                assistantResponse += parsed.choices[0].delta.content;
              } else if (parsed.choices && parsed.choices[0]?.message?.content) {
                assistantResponse = parsed.choices[0].message.content;
              } else if (parsed.results && parsed.results[0]?.generated_text) {
                assistantResponse = parsed.results[0].generated_text;
              } else if (parsed.generated_text) {
                assistantResponse = parsed.generated_text;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }

      if (assistantResponse) {
        return res.status(200).json({
          choices: [{
            message: {
              role: 'assistant',
              content: assistantResponse
            }
          }]
        });
      } else {
        return res.status(200).json({
          choices: [{
            message: {
              role: 'assistant',
              content: responseText
            }
          }]
        });
      }
    } catch (error) {
      console.error('Error parsing Watson response:', error);
      return res.status(200).json({
        choices: [{
          message: {
            role: 'assistant',
            content: responseText
          }
        }]
      });
    }
  } catch (error) {
    console.error('Error in serverless function:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};

// Made with Bob
