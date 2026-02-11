#!/bin/bash

# Script to run Renovate against GitHub repository
# Usage: ./run-renovate-github.sh [REPO_NAME]
#
# Requirements:
# - Set RENOVATE_TOKEN environment variable with your GitHub token
#   (create at: https://github.com/settings/tokens)
#   Required scopes: repo (for private repos) or public_repo (for public repos)

set -e

echo "🔧 Running Renovate against GitHub repository..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if RENOVATE_TOKEN is set
if [ -z "$RENOVATE_TOKEN" ]; then
    echo "❌ RENOVATE_TOKEN is not set!"
    echo ""
    echo "Please set your GitHub token:"
    echo "  export RENOVATE_TOKEN=ghp_your_token_here"
    echo ""
    echo "Create a token at: https://github.com/settings/tokens"
    echo "Required scopes: repo (private) or public_repo (public)"
    exit 1
fi

# Set repository to renovate (use argument or default)
REPO="${1:-Dawo9889/sharable-renovate-config}"

echo "📊 Configuration:"
echo "  Repository: $REPO"
echo "  Platform: GitHub"
echo "  Dry Run: ${RENOVATE_DRY_RUN:-full}"
echo ""

# Set environment variables
export RENOVATE_PLATFORM=github
export LOG_LEVEL=${LOG_LEVEL:-info}
export RENOVATE_DRY_RUN=${RENOVATE_DRY_RUN:-full}

echo "📦 Pulling latest Renovate image..."
docker pull renovate/renovate:latest

echo ""
echo "🚀 Starting Renovate..."
echo ""

# Run Renovate with GitHub platform
docker run --rm \
  -v "$(pwd):/usr/src/app" \
  -e LOG_LEVEL=$LOG_LEVEL \
  -e RENOVATE_TOKEN=$RENOVATE_TOKEN \
  -e RENOVATE_PLATFORM=github \
  -e RENOVATE_DRY_RUN=$RENOVATE_DRY_RUN \
  renovate/renovate:latest \
  $REPO

echo ""
echo "✅ Renovate run completed!"
echo ""
echo "💡 Tips:"
echo "  - Use LOG_LEVEL=debug for more detailed output"
echo "  - Set RENOVATE_DRY_RUN=false to create actual PRs"
echo "  - Specify repo: ./run-renovate-github.sh owner/repo-name"
