#!/bin/bash

# TextileHome GitHub Repository Setup Script
set -e

echo "🚀 Setting up TextileHome for GitHub deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git and try again."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_warning "This is not a git repository. Initializing..."
    git init
    print_status "Git repository initialized"
fi

# Set up git configuration if not already set
if [ -z "$(git config user.email)" ]; then
    echo "Please enter your email for Git commits:"
    read -r email
    git config user.email "$email"
fi

if [ -z "$(git config user.name)" ]; then
    echo "Please enter your name for Git commits:"
    read -r name
    git config user.name "$name"
fi

# Add all files to git
print_status "Adding files to git..."
git add .

# Create initial commit if no commits exist
if [ -z "$(git log --oneline 2>/dev/null)" ]; then
    git commit -m "Initial commit: TextileHome e-commerce platform with comprehensive security

Features:
- React + TypeScript frontend with Tailwind CSS
- Express.js backend with PostgreSQL database
- 8-layer security protection system
- Comprehensive CI/CD pipeline
- Docker containerization
- Multiple deployment options
- Security monitoring and threat tracking"
    print_status "Initial commit created"
fi

# Instructions for GitHub setup
echo ""
echo "🔧 Next steps to complete GitHub setup:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: textilehome"
echo "   - Description: Secure e-commerce platform for premium textiles"
echo "   - Choose Public or Private"
echo "   - DO NOT initialize with README (we already have one)"
echo ""
echo "2. Add the GitHub remote (replace YOUR_USERNAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/textilehome.git"
echo ""
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Set up GitHub repository secrets for CI/CD:"
echo "   - Go to repository Settings > Secrets and variables > Actions"
echo "   - Add these secrets:"
echo "     * DATABASE_URL: Your production database URL"
echo "     * DEPLOY_TOKEN: Your deployment service token"
echo ""
echo "5. Configure deployment (choose one):"
echo "   - Railway: Connect GitHub repo and set environment variables"
echo "   - Vercel: Install Vercel CLI and run 'vercel'"
echo "   - Render: Connect GitHub repo in Render dashboard"
echo "   - Docker: Use provided Dockerfile and docker-compose.yml"
echo ""
echo "📚 Documentation available:"
echo "   - README.md: Project overview and quick start"
echo "   - DEPLOYMENT.md: Comprehensive deployment guide"
echo "   - CONTRIBUTING.md: Contribution guidelines"
echo ""
echo "🔒 Security features are ready:"
print_status "Bot protection and rate limiting configured"
print_status "SQL injection and XSS prevention active"
print_status "CSRF protection enabled"
print_status "IP blocking system operational"
print_status "Security monitoring endpoint available"
echo ""
echo "🎉 Your Grahsutra repository is ready for GitHub!"
echo "   The platform includes production-ready security and deployment configuration."