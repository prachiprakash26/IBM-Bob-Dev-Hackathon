# Setup Guide - Installing Node.js and Running the Application

## Prerequisites Installation

Since Node.js and npm are not currently installed on your system, follow these steps:

### Step 1: Install Node.js

1. **Download Node.js:**
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS (Long Term Support)** version for Windows
   - Recommended: Node.js 18.x or higher

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **Important:** Check the box that says "Automatically install the necessary tools"
   - Accept the default installation path
   - Click "Install"

3. **Verify Installation:**
   - Open a **new** PowerShell or Command Prompt window
   - Run these commands:
   ```bash
   node --version
   npm --version
   ```
   - You should see version numbers (e.g., v18.17.0 and 9.6.7)

### Step 2: Install Project Dependencies

Once Node.js is installed:

1. **Navigate to the project directory:**
   ```bash
   cd "e:\IBM Hackathon\watson-rag-chat"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will install:
   - React 18.2.0
   - React DOM 18.2.0
   - React Scripts 5.0.1
   - All other required dependencies

   **Note:** This may take 2-5 minutes depending on your internet connection.

### Step 3: Start the Application

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Wait for compilation:**
   - The app will compile (takes 30-60 seconds on first run)
   - Your default browser will automatically open
   - The app will be available at: http://localhost:3000

3. **Start chatting:**
   - Type your questions about the book
   - Press Enter or click Send
   - Watson will respond with answers

## Alternative: Using Yarn (Optional)

If you prefer Yarn over npm:

1. **Install Yarn:**
   ```bash
   npm install -g yarn
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start the app:**
   ```bash
   yarn start
   ```

## Troubleshooting

### Issue: "npm is not recognized"

**Solution:**
1. Close all PowerShell/Command Prompt windows
2. Open a **new** window (this loads the updated PATH)
3. Try the npm command again

If still not working:
1. Restart your computer
2. Open a new terminal
3. Try again

### Issue: Port 3000 is already in use

**Solution:**
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

Or use a different port:
```bash
set PORT=3001 && npm start
```

### Issue: Installation fails with permission errors

**Solution:**
1. Run PowerShell as Administrator
2. Try the installation again

### Issue: Slow installation

**Solution:**
- This is normal for first-time installation
- React Scripts downloads many dependencies
- Wait patiently (can take 5-10 minutes on slow connections)

## Development Commands

Once Node.js is installed, you can use these commands:

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (advanced, irreversible)
npm run eject
```

## Project File Structure

After installation, your project will look like this:

```
watson-rag-chat/
├── node_modules/          # Dependencies (created after npm install)
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── index.js
├── .env                   # Your Watson credentials
├── .gitignore
├── package.json
├── package-lock.json      # Created after npm install
└── README.md
```

## Environment Setup Checklist

- [ ] Node.js installed (v14 or higher)
- [ ] npm available in terminal
- [ ] Project dependencies installed (`npm install`)
- [ ] `.env` file contains Watson credentials
- [ ] Development server starts successfully (`npm start`)
- [ ] Application opens in browser
- [ ] Can send messages and receive responses

## Next Steps After Installation

1. **Test the application:**
   - Send a test message
   - Verify Watson responds
   - Check that messages persist after refresh

2. **Customize if needed:**
   - Update colors in CSS files
   - Modify welcome message in ChatWindow.jsx
   - Add additional features

3. **Deploy (optional):**
   - Build production version: `npm run build`
   - Deploy to hosting service (Netlify, Vercel, etc.)

## Getting Help

If you encounter issues:

1. **Check Node.js installation:**
   ```bash
   node --version
   npm --version
   ```

2. **Check for error messages:**
   - Read the terminal output carefully
   - Look for specific error messages
   - Search for the error online

3. **Common solutions:**
   - Restart terminal
   - Restart computer
   - Delete `node_modules` and run `npm install` again
   - Check internet connection

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [npm Documentation](https://docs.npmjs.com/)
- [IBM Watson Documentation](https://cloud.ibm.com/docs/watson)

---

**Once Node.js is installed, you'll be ready to run the application! 🚀**