#!/bin/bash

echo "🔧 Pushing GitHub Actions fixes..."

# Add the updated workflow files
git add .github/workflows/
git add commit-fixes.sh

# Commit the fixes
git commit -m "Fix GitHub Actions permissions and add basic CI workflow

- Added proper permissions to security.yml workflow
- Added permissions to ci-cd.yml workflow  
- Added permissions to ci.yml workflow
- Created basic-ci.yml for simple builds without special permissions
- All workflows now have: contents: read, security-events: write, actions: read, checks: write"

# Push to GitHub
git push origin main

echo "✅ GitHub Actions fixes pushed successfully!"
echo ""
echo "The CI/CD pipeline should now run without permission errors."
echo "Visit: https://github.com/adidwd/Grihsutra/actions to check the status."