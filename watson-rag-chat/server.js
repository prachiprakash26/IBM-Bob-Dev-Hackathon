/**
 * Express Proxy Server for Watson API
 * Handles CORS issues by proxying requests from frontend to Watson
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Watson configuration
const WATSON_API_KEY = process.env.REACT_APP_WATSON_API_KEY;
const WATSON_DEPLOYMENT_ID = process.env.REACT_APP_WATSON_DEPLOYMENT_ID;
const WATSON_API_URL = process.env.REACT_APP_WATSON_API_URL;
const WATSON_TOKEN_URL = process.env.REACT_APP_WATSON_TOKEN_URL;

let cachedToken = null;
let tokenExpiry = null;

/**
 * Get Watson authentication token
 */
async function getWatsonToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('✅ Using cached token');
    return cachedToken;
  }

  try {
    console.log('🔑 Requesting new token from:', WATSON_TOKEN_URL);
    console.log('🔑 API Key (first 20 chars):', WATSON_API_KEY?.substring(0, 20) + '...');
    
    const params = new URLSearchParams({
      apikey: WATSON_API_KEY,
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
    });
    
    console.log('📤 Auth request body:', params.toString());

    const response = await fetch(WATSON_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    console.log('📥 Auth response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ Auth error response:', errorBody);
      throw new Error(`Authentication failed: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    console.log('✅ Token received successfully');
    cachedToken = data.access_token;
    // Set token expiry to 50 minutes (tokens typically last 60 minutes)
    tokenExpiry = Date.now() + 50 * 60 * 1000;

    return cachedToken;
  } catch (error) {
    console.error('❌ Error getting Watson token:', error.message);
    throw error;
  }
}

/**
 * POST /api/chat - Send message to Watson
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    console.log('📨 Received chat request with', messages?.length, 'messages');

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    // Get authentication token
    console.log('🔐 Getting Watson authentication token...');
    const token = await getWatsonToken();
    console.log('✅ Token obtained successfully');

    // Prepare the request payload
    const payload = { messages };
    console.log('📤 Sending to Watson:', JSON.stringify(payload, null, 2));

    // Call Watson API - using exact URL from original code
    const watsonUrl = `${WATSON_API_URL}/deployments/${WATSON_DEPLOYMENT_ID}/ai_service_stream?version=2021-05-01`;
    console.log('🌐 Watson URL:', watsonUrl);

    const response = await fetch(watsonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('📥 Watson response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Watson API error response:', errorText);
      return res.status(response.status).json({
        error: `Watson API request failed: ${response.statusText}`,
        details: errorText,
      });
    }

    // Watson returns a streaming response (Server-Sent Events)
    // We need to read the text and parse it
    const responseText = await response.text();
    console.log('📥 Raw Watson response:', responseText.substring(0, 200) + '...');

    // Parse the streaming response
    // Format is typically: id: 1\nevent: message\ndata: {...}\n\n
    let assistantResponse = '';
    
    try {
      // Split by lines and find data lines
      const lines = responseText.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonData = line.substring(6); // Remove 'data: ' prefix
          if (jsonData.trim() && jsonData !== '[DONE]') {
            try {
              const parsed = JSON.parse(jsonData);
              // Extract the content from various possible formats
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
              console.log('Skipping line:', line.substring(0, 50));
            }
          }
        }
      }

      if (assistantResponse) {
        console.log('✅ Extracted response:', assistantResponse.substring(0, 100) + '...');
        res.json({
          choices: [{
            message: {
              role: 'assistant',
              content: assistantResponse
            }
          }]
        });
      } else {
        // If we couldn't parse the streaming format, return the raw text
        console.log('⚠️ Could not parse streaming format, returning raw response');
        res.json({
          choices: [{
            message: {
              role: 'assistant',
              content: responseText
            }
          }]
        });
      }
    } catch (error) {
      console.error('❌ Error parsing Watson response:', error);
      res.json({
        choices: [{
          message: {
            role: 'assistant',
            content: responseText
          }
        }]
      });
    }
  } catch (error) {
    console.error('❌ Error in /api/chat:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * GET /api/health - Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    watson: {
      configured: !!(WATSON_API_KEY && WATSON_DEPLOYMENT_ID),
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Watson Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat\n`);
  
  // Validate configuration
  if (!WATSON_API_KEY || !WATSON_DEPLOYMENT_ID) {
    console.warn('⚠️  WARNING: Watson credentials not configured in .env file');
  }
});

// Made with Bob
