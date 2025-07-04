#!/bin/bash

echo "🚀 Starting production build process..."

# Step 1: Check if application is working
echo "1. Verifying application functionality..."
if curl -s http://localhost:5000/api/products > /dev/null; then
    echo "✅ Application is running and responding"
else
    echo "❌ Application is not responding"
    exit 1
fi

# Step 2: Build frontend with Vite (this handles TypeScript compilation gracefully)
echo "2. Building frontend with Vite..."
npx vite build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Step 3: Build backend with esbuild (this bundles server code)
echo "3. Building backend with esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

# Step 4: Create production-ready indicator
echo "4. Creating production build indicator..."
echo "Build completed at $(date)" > dist/build-info.txt
echo "Application: Grihsutra E-commerce Platform" >> dist/build-info.txt
echo "Status: Production Ready" >> dist/build-info.txt

echo "🎉 Production build completed successfully!"
echo "📁 Built files are in the 'dist' directory"
echo "🚀 Ready for deployment"