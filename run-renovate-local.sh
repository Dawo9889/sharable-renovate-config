#!/bin/bash

# Script to run Renovate locally for testing
# Usage: ./run-renovate-local.sh

set -e

echo "🔧 Running Renovate locally..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Set environment variables for local testing
export RENOVATE_DRY_RUN=full
export RENOVATE_PLATFORM=local
export LOG_LEVEL=debug

# You can optionally set a token for GitHub API (increases rate limits)
# export RENOVATE_TOKEN=your_github_token_here

echo "📦 Pulling latest Renovate image..."
docker pull renovate/renovate:latest

echo ""
echo "🚀 Starting Renovate..."
echo ""

# Run Renovate with the current directory mounted
docker run --rm \
  -v "$(pwd):/usr/src/app" \
  -e LOG_LEVEL=info \
  -e RENOVATE_CONFIG_FILE=/usr/src/app/renovate.json \
  renovate/renovate:latest \
  --platform=local \
  --dry-run=full \
  --detect-host-rules-from-env=false

echo ""
echo "✅ Renovate run completed!"
echo ""
echo "💡 Tips:"
echo "  - Check the logs above for detected dependencies"
echo "  - To use with GitHub, set RENOVATE_TOKEN environment variable"
echo "  - Modify renovate-config.js to customize behavior"
