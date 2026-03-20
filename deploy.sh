#!/bin/bash

# HyperStack Deployment Script
# This script helps deploy the HyperStack project to Vercel

set -e

echo "🚀 HyperStack Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    echo "❌ Error: Please run this script from the hyperstack root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "📝 Please login to Vercel:"
    vercel login
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
echo "⚠️  Make sure you have set these environment variables in Vercel:"
echo "   - GROQ_API_KEY (your Groq API key)"
echo "   - GROQ_MODEL (recommended: llama-3.3-70b-versatile)"
echo "   - CLIENT_ORIGIN (your Vercel domain)"
echo ""

read -p "Continue with deployment? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
    echo ""
    echo "🎉 Deployment complete!"
    echo "📝 Don't forget to set your environment variables in the Vercel dashboard!"
else
    echo "❌ Deployment cancelled"
    exit 1
fi
