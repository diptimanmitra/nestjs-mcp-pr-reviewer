#!/bin/bash

echo "🚀 Setting up NestJS MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys before running the server"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your GitHub and Notion API keys"
echo "2. Run 'npm run start:dev' to start development server"
echo "3. Run 'npm run start:prod' for production"
echo ""
echo "For Claude Desktop integration, add this server to your MCP settings."
