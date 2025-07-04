#!/bin/bash

echo "🚀 Setting up Git repository for Grihsutra..."

# Check if git is already initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Add remote if not already added
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "Adding GitHub remote..."
    git remote add origin https://github.com/adidwd/Grihsutra
else
    echo "Remote already exists, updating..."
    git remote set-url origin https://github.com/adidwd/Grihsutra
fi

# Add all files
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit: Grihsutra e-commerce platform with CI/CD"

# Set main branch
echo "Setting main branch..."
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "✅ Git setup complete!"
echo "📍 Your repository: https://github.com/adidwd/Grihsutra"
echo ""
echo "Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Set up GitHub Secrets for CI/CD"
echo "3. Connect to Railway for deployment"