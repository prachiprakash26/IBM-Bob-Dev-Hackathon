# Simple GitHub Upload Guide

## Step 1: Install Git (One-time setup)

1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use all default settings
4. Click "Install"
5. **Restart your PowerShell/Terminal**

## Step 2: Create GitHub Repository

1. Go to https://github.com
2. Sign in (or create account if you don't have one)
3. Click the **"+"** button (top right) → **"New repository"**
4. Fill in:
   - **Repository name:** `IBM-Hackathon`
   - **Description:** `Pride & Prejudice AI Assistant - IBM Watson RAG Hackathon Project`
   - **Public** (so others can see it)
   - **DO NOT** check "Initialize with README"
5. Click **"Create repository"**

## Step 3: Upload Your Folder

### Option A: Using Git (Recommended)

Open PowerShell in the `IBM Hackathon` folder and run these commands:

```powershell
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "IBM Hackathon: Pride & Prejudice AI Assistant"

# Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/IBM-Hackathon.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** When it asks for password, use a **Personal Access Token**:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "IBM Hackathon Upload"
4. Check the "repo" checkbox
5. Click "Generate token"
6. Copy the token and use it as your password

### Option B: Using GitHub Desktop (Easier)

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click "Add" → "Add Existing Repository"
4. Browse to `E:\IBM Hackathon`
5. Click "Publish repository"
6. Make sure "Keep this code private" is **UNCHECKED** (for public repo)
7. Click "Publish repository"

### Option C: Upload via Web (Simplest but limited)

**Warning:** This only works for small projects. Your project might be too large.

1. On your GitHub repository page, click "uploading an existing file"
2. Drag and drop the entire `IBM Hackathon` folder
3. Add commit message: "Initial upload"
4. Click "Commit changes"

## Step 4: Verify Upload

1. Go to your repository: `https://github.com/YOUR_USERNAME/IBM-Hackathon`
2. You should see all your files and folders
3. Check that `watson-rag-chat` folder is there

## Important: Protect Your API Keys

Before pushing, make sure:
- ✅ `.env` file is in `.gitignore` (it already is)
- ✅ Your API keys won't be visible on GitHub

To verify:
1. After pushing, check your GitHub repository
2. Look for the `.env` file - it should NOT be there
3. You should see `.env.example` instead (which is safe)

## Your Repository URL

After upload, your project will be at:
```
https://github.com/YOUR_USERNAME/IBM-Hackathon
```

Share this URL for your hackathon submission!

## Troubleshooting

### "git is not recognized"
- Git is not installed or not in PATH
- Install Git from the link above
- Restart your terminal

### "Permission denied"
- Use Personal Access Token instead of password
- Generate at: https://github.com/settings/tokens

### "Repository not found"
- Check you spelled the repository name correctly
- Make sure you created the repository on GitHub first

### Files too large
- GitHub has a 100MB file limit
- If you have large files, use Git LFS or remove them

## What Gets Uploaded

Your entire folder structure:
```
IBM Hackathon/
├── bob_sessions/           # Your session files
├── watson-rag-chat/        # Your React app
│   ├── src/               # Source code
│   ├── public/            # Public files
│   ├── api/               # Serverless functions
│   ├── README.md          # Documentation
│   └── ... (all other files)
└── SIMPLE_GITHUB_GUIDE.md # This guide
```

**Note:** The `.env` file with your API keys will NOT be uploaded (it's in .gitignore)

## Next Steps

After uploading to GitHub:
1. ✅ Your code is backed up
2. ✅ You can share the GitHub URL
3. ✅ Others can see your code (but not your API keys)
4. ✅ You have version control

If you want a **live demo URL** later, you can deploy to:
- Vercel (free): https://vercel.com
- Netlify (free): https://netlify.com
- GitHub Pages (free, but needs configuration)

But for now, just having it on GitHub is enough! 🎉