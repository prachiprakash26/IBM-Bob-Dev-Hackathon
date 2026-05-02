/**
 * Test script to verify Watson API key authentication
 */

const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.REACT_APP_WATSON_API_KEY;
const TOKEN_URL = process.env.REACT_APP_WATSON_TOKEN_URL;

console.log('Testing Watson API Key Authentication...\n');
console.log('API Key (first 30 chars):', API_KEY?.substring(0, 30) + '...');
console.log('Token URL:', TOKEN_URL);
console.log('\nAttempting to get token...\n');

async function testAuth() {
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

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('\n❌ Authentication FAILED');
      console.error('Error response:', errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log('\n✅ Authentication SUCCESSFUL!');
    console.log('Token received (first 50 chars):', data.access_token.substring(0, 50) + '...');
    console.log('Token type:', data.token_type);
    console.log('Expires in:', data.expires_in, 'seconds');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testAuth();

// Made with Bob
