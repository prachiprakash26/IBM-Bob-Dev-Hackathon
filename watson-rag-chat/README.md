# Watson RAG Chat Application

A modern, responsive React chat application that integrates with IBM Watson's RAG (Retrieval-Augmented Generation) service to answer questions about books.

## Features

✨ **Modern Chat Interface** - Clean, intuitive UI with smooth animations  
💬 **Real-time Messaging** - Instant communication with Watson Assistant  
📝 **Chat History** - Persistent conversation history using local storage  
⏰ **Timestamps** - Smart timestamp formatting (relative and absolute)  
⌨️ **Typing Indicators** - Visual feedback when Watson is processing  
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices  
🎨 **Beautiful Styling** - Gradient backgrounds and modern design patterns  
⚡ **Error Handling** - Graceful error messages and retry mechanisms  

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd watson-rag-chat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   The `.env` file is already created with your Watson credentials. If you need to update them, edit the `.env` file:
   ```
   REACT_APP_WATSON_API_KEY=your-api-key-here
   REACT_APP_WATSON_DEPLOYMENT_ID=your-deployment-id-here
   REACT_APP_WATSON_API_URL=https://us-south.ml.cloud.ibm.com/ml/v4
   REACT_APP_WATSON_TOKEN_URL=https://iam.cloud.ibm.com/identity/token
   ```

   **⚠️ Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

## Running the Application

**Important:** This application requires both a backend proxy server and the React frontend to run.

### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev
```

This will start:
- Backend proxy server on port 3001
- React frontend on port 3000

The browser will automatically open at [http://localhost:3000](http://localhost:3000)

### Option 2: Run Servers Separately

**Terminal 1 - Start the proxy server:**
```bash
npm run server
```

**Terminal 2 - Start the React app:**
```bash
npm start
```

### Start Chatting

Once both servers are running:
1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Type your questions about the book in the input field
3. Press Enter or click the send button
4. Watson will respond with answers based on the book content

**Note:** The proxy server (port 3001) must be running for the chat to work. It handles authentication and communication with Watson API to avoid CORS issues.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The build files will be generated in the `build/` directory.

## Project Structure

```
watson-rag-chat/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── ChatWindow.jsx      # Main chat container
│   │   ├── ChatMessage.jsx     # Individual message display
│   │   ├── ChatInput.jsx       # Message input field
│   │   └── TypingIndicator.jsx # Loading animation
│   ├── hooks/
│   │   └── useChatHistory.js   # Custom hook for chat state
│   ├── services/
│   │   └── watsonService.js    # Watson API integration
│   ├── styles/                 # CSS files
│   │   ├── App.css
│   │   ├── ChatWindow.css
│   │   ├── ChatMessage.css
│   │   ├── ChatInput.css
│   │   └── TypingIndicator.css
│   ├── utils/
│   │   └── storage.js          # Local storage utilities
│   ├── App.jsx                 # Root component
│   └── index.js                # Entry point
├── .env                        # Environment variables (not in git)
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Usage Guide

### Sending Messages

1. Type your question in the input field at the bottom
2. Press **Enter** or click the **Send** button
3. Wait for Watson to process and respond
4. Continue the conversation naturally

### Keyboard Shortcuts

- **Enter** - Send message
- **Shift + Enter** - New line in message

### Clearing History

Click the **"Clear History"** button in the header to delete all messages. This action requires confirmation.

### Chat History

- Messages are automatically saved to your browser's local storage
- History persists across browser sessions
- Clear your browser data to remove all stored messages

## Features in Detail

### Watson Integration

The application uses IBM Watson's RAG service to:
- Authenticate using API keys
- Send user messages with conversation context
- Receive intelligent responses based on book content
- Handle errors gracefully with user-friendly messages

### Message Timestamps

Timestamps are displayed in a smart, readable format:
- "Just now" - Less than a minute ago
- "X minutes ago" - Less than an hour ago
- "HH:MM AM/PM" - Earlier today
- "Yesterday at HH:MM AM/PM" - Yesterday
- "MMM DD, HH:MM AM/PM" - Older messages

### Responsive Design

The application adapts to different screen sizes:
- **Desktop** - Full-featured chat window with optimal spacing
- **Tablet** - Adjusted layout for medium screens
- **Mobile** - Full-screen chat optimized for touch interaction

## Troubleshooting

### Application won't start

**Problem:** `npm start` fails  
**Solution:** 
1. Delete `node_modules` folder
2. Run `npm install` again
3. Try `npm start` again

### Watson API errors

**Problem:** "Failed to authenticate with Watson API"  
**Solution:**
1. Verify your API key in `.env` file
2. Check that the deployment ID is correct
3. Ensure you have internet connectivity
4. Check IBM Cloud service status

**Problem:** "Watson API request failed"  
**Solution:**
1. Check your Watson deployment is active
2. Verify the API URL is correct
3. Check your IBM Cloud account permissions

### Messages not persisting

**Problem:** Chat history disappears on refresh  
**Solution:**
1. Check browser's local storage is enabled
2. Ensure you're not in private/incognito mode
3. Check browser console for storage errors

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Technologies Used

- **React 18** - UI framework
- **React Hooks** - State management
- **Fetch API** - HTTP requests
- **Local Storage API** - Data persistence
- **CSS3** - Styling and animations
- **IBM Watson** - AI/RAG backend

## Security Notes

- API keys are stored in environment variables
- Never commit `.env` file to version control
- Use environment-specific configurations for production
- Consider implementing rate limiting for production use

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational and demonstration purposes.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review IBM Watson documentation
3. Check browser console for error messages
4. Verify all environment variables are set correctly

## Acknowledgments

- IBM Watson for the RAG service
- React team for the excellent framework
- The open-source community

---

**Happy Chatting! 🚀**