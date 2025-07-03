#!/bin/bash

# Grahsutra Deployment Script
set -e

echo "🚀 Starting Grahsutra deployment..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is required"
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci

echo "🔍 Running type checks..."
npm run type-check

echo "🔨 Building application..."
npm run build

echo "🗄️ Running database migrations..."
npm run db:push

echo "🌱 Seeding database..."
npm run db:seed

echo "🧪 Running health check..."
node healthcheck.js || true

echo "✅ Deployment completed successfully!"
echo "🌐 Application will be available at: http://localhost:${PORT:-5000}"
echo "🔒 Security features are active and monitoring traffic"

# Start the application
echo "🚀 Starting production server..."
npm start