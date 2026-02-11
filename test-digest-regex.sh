#!/bin/bash

# Test if updated regex matches images with and without digests

echo "🧪 Testing updated regex pattern for Docker images with digests"
echo ""

# Test cases
IMAGE1="europe-docker.pkg.dev/kyma-project/prod/dashboard-token-proxy:v20260211-dc8ccc66"
IMAGE2="europe-docker.pkg.dev/kyma-project/prod/test-infra/rotate-service-account:v20260211-dc8ccc66@sha256:70095ef7d4a3dec6596a1ca44793f28d47427c1a100c1c7f95233f9dc610eebd"

# Updated pattern (simplified for bash testing)
PATTERN='[a-z0-9.-]+\.[a-z0-9.-]+(/[a-z0-9._-]+)+:v?[0-9][\w.-]+(@sha256:[a-f0-9]+)?'

echo "Test 1: Image without digest"
echo "Image: $IMAGE1"
echo "$IMAGE1" | grep -E "$PATTERN" > /dev/null && echo "✅ MATCH!" || echo "❌ NO MATCH"
echo ""

echo "Test 2: Image with digest"
echo "Image: $IMAGE2"
echo "$IMAGE2" | grep -E "$PATTERN" > /dev/null && echo "✅ MATCH!" || echo "❌ NO MATCH"
echo ""

echo "Extracting components:"
echo "$IMAGE2" | grep -oE '[a-z0-9.-]+\.[a-z0-9.-]+(/[a-z0-9._-]+)+' | head -1 | xargs -I {} echo "  depName: {}"
echo "$IMAGE2" | grep -oE ':v?[0-9][a-z0-9._-]+' | sed 's/://' | xargs -I {} echo "  version: {}"
echo "$IMAGE2" | grep -oE 'sha256:[a-f0-9]+' | xargs -I {} echo "  digest: {}"
