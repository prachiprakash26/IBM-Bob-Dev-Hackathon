# Quick Start Guide - Fixing CORS Issues

## The Problem

You encountered CORS (Cross-Origin Resource Sharing) errors when trying to call Watson API directly from the browser. This is a security feature that prevents browsers from making requests to different domains.

## The Solution

I've added a **backend proxy server** that:
1. Runs on your local machine (port 3001)
2. Handles Watson API authentication
3. Forwards requests from your React app to Watson
4. Returns responses back to the browser

This eliminates CORS issues because the browser only talks to your local server.

## How to Run (Step by Step)

### Step 1: Stop Current Servers

If you have any servers running, stop them:
- Press `Ctrl + C` in any terminal windows running the app

### Step 2: Install New Dependencies

```bash
cd watson-rag-chat
npm install
```

This installs:
- `express` - Web server framework
- `cors` - CORS middleware
- `node-fetch` - HTTP client for Node.js
- `dotenv` - Environment variable loader
- `concurrently` - Run multiple commands simultaneously

### Step 3: Run Both Servers

**Easiest way - Run both together:**
```bash
npm run dev
```

This single command starts:
- ✅ Backend proxy server (port 3001)
- ✅ React frontend (port 3000)

**Alternative - Run separately in two terminals:**

Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm start
```

### Step 4: Test the Application

1. Browser should open automatically at http://localhost:3000
2. You should see the chat interface
3. Type a question and press Enter
4. Watson should respond without errors!

## Verifying It Works

### Check Backend Server

Open http://localhost:3001/api/health in your browser.

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-05-01T16:25:00.000Z",
  "watson": {
    "configured": true
  }
}
```

### Check Frontend

1. Open http://localhost:3000
2. Open browser console (F12)
3. Send a test message
4. You should see NO CORS errors
5. Watson should respond with an answer

## Architecture Overview

```
┌─────────────────┐
│   Browser       │
│  (Port 3000)    │
│                 │
│  React App      │
└────────┬────────┘
         │
         │ HTTP Request
         │ (No CORS issues - same origin)
         │
         ▼
┌─────────────────┐
│  Proxy Server   │
│  (Port 3001)    │
│                 │
│  Express.js     │
└────────┬────────┘
         │
         │ HTTP Request
         │ (Server-to-server - no CORS)
         │
         ▼
┌─────────────────┐
│  Watson API     │
│  (IBM Cloud)    │
│                 │
│  RAG Service    │
└─────────────────┘
```

## What Changed

### 1. New Files
- `server.js` - Express proxy server
- `QUICK_START.md` - This guide

### 2. Modified Files
- `package.json` - Added server dependencies and scripts
- `src/services/watsonService.js` - Now calls proxy instead of Watson directly
- `.env` - Added proxy URL configuration
- `README.md` - Updated with new running instructions

### 3. New npm Scripts
- `npm run server` - Start only the proxy server
- `npm run dev` - Start both servers together

## Troubleshooting

### Error: "Cannot connect to server"

**Problem:** Proxy server is not running

**Solution:**
```bash
# Make sure you're running both servers
npm run dev
```

### Error: "Port 3001 already in use"

**Problem:** Another process is using port 3001

**Solution:**
```bash
# Windows - Find and kill the process
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Then restart
npm run dev
```

### Error: "npm install fails"

**Problem:** Dependency installation issues

**Solution:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Watson Still Not Responding

**Check these:**

1. **Proxy server is running:**
   - Visit http://localhost:3001/api/health
   - Should show `"status": "ok"`

2. **Environment variables are set:**
   - Check `.env` file has all Watson credentials
   - Restart servers after changing `.env`

3. **Watson credentials are valid:**
   - Verify API key in IBM Cloud console
   - Check deployment ID is correct

4. **Check browser console:**
   - Press F12
   - Look for error messages
   - Share them if you need help

## Testing the Fix

### Test 1: Health Check
```bash
# In browser or terminal
curl http://localhost:3001/api/health
```

Expected: `{"status":"ok",...}`

### Test 2: Send a Message

In the chat interface, type:
```
What is this book about?
```

Expected: Watson responds with information about the book

### Test 3: Check Console

1. Open browser console (F12)
2. Send a message
3. Look for network requests
4. Should see request to `http://localhost:3001/api/chat`
5. Should NOT see CORS errors

## Success Indicators

✅ Both servers start without errors  
✅ Health check returns OK  
✅ Chat interface loads  
✅ Messages send successfully  
✅ Watson responds with answers  
✅ No CORS errors in console  
✅ Chat history persists on refresh  

## Next Steps

Once everything works:

1. **Test thoroughly** - Try different questions
2. **Check persistence** - Refresh page, history should remain
3. **Test error handling** - Stop proxy server, see error message
4. **Customize** - Modify styles, add features
5. **Deploy** - Consider deploying to a hosting service

## Need Help?

If you're still having issues:

1. Check all servers are running
2. Verify `.env` file has correct credentials
3. Look at browser console for errors
4. Check proxy server terminal for errors
5. Try restarting both servers

---

**You should now be able to chat with Watson without CORS errors! 🎉**