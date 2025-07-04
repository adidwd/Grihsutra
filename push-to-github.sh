#!/bin/bash

echo "🚀 Setting up Grihsutra for GitHub..."

# Remove any lock files
rm -f .git/index.lock
rm -f .git/config.lock

# Initialize git if needed
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Configure git user (replace with your details)
git config user.name "adidwd"
git config user.email "your-email@example.com"  # Replace with your actual email

# Add all files
git add .
echo "✅ Files added to staging"

# Create initial commit
git commit -m "Initial commit: Complete Grihsutra e-commerce application

Features:
- React + TypeScript frontend with Tailwind CSS  
- Express.js backend with PostgreSQL database
- Admin dashboard with authentication
- Bedtime Buddy interactive mascot
- 8-layer security protection system
- Comprehensive CI/CD pipeline ready
- Docker deployment configuration
- Complete documentation and deployment guides"

echo "✅ Initial commit created"

# Add GitHub remote
git remote add origin https://github.com/adidwd/Grihsutra.git
echo "✅ GitHub remote added"

# Set main branch and push
git branch -M main
git push -u origin main

echo "🎉 Successfully pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Visit: https://github.com/adidwd/Grihsutra"
echo "2. Set up deployment on Railway, Vercel, or your preferred platform"
echo "3. Add DATABASE_URL environment variable for production"
echo ""
echo "Your Grihsutra e-commerce app is now on GitHub! 🚀"