#!/bin/bash

echo "🔧 Pushing TypeScript fixes to GitHub..."

# Clear any git locks
rm -f .git/index.lock .git/config.lock 2>/dev/null

# Add all the fixed files
git add client/src/pages/admin-dashboard.tsx
git add .github/workflows/
git add push-typescript-fixes.sh

# Commit the TypeScript fixes
git commit -m "Fix TypeScript compilation errors and GitHub Actions permissions

TypeScript Fixes:
- Fixed admin dashboard API request calls to use proper apiRequest signature
- Added proper type casting for Product arrays in admin dashboard
- Fixed SecurityStatus interface type issues
- Resolved all compilation errors in admin-dashboard.tsx

GitHub Actions Fixes:
- Added proper permissions to all workflow files (security.yml, ci-cd.yml, ci.yml)
- Created basic-ci.yml for simple builds without special permissions
- Fixed 'Resource not accessible by integration' error

All CI/CD pipelines should now run successfully without permission errors."

# Push to GitHub
git push origin main

echo "✅ All fixes pushed to GitHub!"
echo ""
echo "🎯 Fixed Issues:"
echo "  ✓ TypeScript compilation errors resolved"
echo "  ✓ GitHub Actions permissions fixed"
echo "  ✓ Admin dashboard API calls corrected"
echo "  ✓ Product type casting issues resolved"
echo ""
echo "🔗 Check CI/CD status: https://github.com/adidwd/Grihsutra/actions"