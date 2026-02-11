#!/bin/bash

# Prosty skrypt do budowania i pushowania testowych obrazów do Docker Hub
# Użycie: ./build-test-images.sh DOCKER_USERNAME

set -e

# Sprawdź czy podano username
if [ -z "$1" ]; then
    echo "❌ Podaj Docker Hub username!"
    echo "Użycie: ./build-test-images.sh TWOJ_USERNAME"
    exit 1
fi

DOCKER_USER="$1"
IMAGE_NAME="renovate-test"
FULL_NAME="${DOCKER_USER}/${IMAGE_NAME}"

echo "════════════════════════════════════════════════════════════════"
echo "🐋 BUILD TEST IMAGES DLA RENOVATE"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Docker Hub User: ${DOCKER_USER}"
echo "Image:           ${IMAGE_NAME}"
echo "Full name:       ${FULL_NAME}"
echo ""

cd "$(dirname "$0")"

# Build v1.0.0
echo ""
echo "────────────────────────────────────────────────────────────────"
echo "🔨 Buduję v1.0.0..."
docker build \
    --build-arg VERSION=1.0.0 \
    -t ${FULL_NAME}:v1.0.0 \
    -t ${FULL_NAME}:1.0.0 \
    -t ${FULL_NAME}:latest \
    .

# Build v1.1.0
echo ""
echo "────────────────────────────────────────────────────────────────"
echo "🔨 Buduję v1.1.0..."
docker build \
    --build-arg VERSION=1.1.0 \
    -t ${FULL_NAME}:v1.1.0 \
    -t ${FULL_NAME}:1.1.0 \
    .

# Build v2.0.0
echo ""
echo "────────────────────────────────────────────────────────────────"
echo "🔨 Buduję v2.0.0..."
docker build \
    --build-arg VERSION=2.0.0 \
    -t ${FULL_NAME}:v2.0.0 \
    -t ${FULL_NAME}:2.0.0 \
    .

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🚀 PUSH DO DOCKER HUB"
echo "════════════════════════════════════════════════════════════════"
echo "Pushing v1.0.0..."
docker push ${FULL_NAME}:v1.0.0
docker push ${FULL_NAME}:1.0.0
docker push ${FULL_NAME}:latest

echo "Pushing v1.1.0..."
docker push ${FULL_NAME}:v1.1.0
docker push ${FULL_NAME}:1.1.0

echo "Pushing v2.0.0..."
docker push ${FULL_NAME}:v2.0.0
docker push ${FULL_NAME}:2.0.0

echo ""
echo "✅ Wszystkie obrazy wypchnięte do Docker Hub!"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📝 NASTĘPNE KROKI"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1. Sprawdź obrazy na Docker Hub:"
echo "   https://hub.docker.com/r/${DOCKER_USER}/${IMAGE_NAME}"
echo ""
echo "2. Pobierz digest dla testów:"
echo "   docker pull ${FULL_NAME}:v1.0.0"
echo "   docker inspect ${FULL_NAME}:v1.0.0 --format='{{index .RepoDigests 0}}'"
echo ""
echo "3. Dodaj do renovate-test.yaml:"
echo "   - ${FULL_NAME}:v1.0.0"
echo ""
echo "4. Uruchom Renovate - wykryje update do v2.0.0!"
echo ""
echo "════════════════════════════════════════════════════════════════"
