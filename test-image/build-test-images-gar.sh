#!/bin/bash

# Skrypt do budowania i pushowania testowych obrazów do Google Artifact Registry
# Użycie: ./build-test-images-gar.sh

set -e

# Konfiguracja
PROJECT_ID="sap-kyma-neighbors-dev"
LOCATION="europe-west3"
REPOSITORY="renovate-private-registry-test"
IMAGE_NAME="renovate-test"
FULL_NAME="${LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}"

echo "════════════════════════════════════════════════════════════════"
echo "🐋 BUILD TEST IMAGES DLA RENOVATE - GOOGLE ARTIFACT REGISTRY"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Project:         ${PROJECT_ID}"
echo "Location:        ${LOCATION}"
echo "Repository:      ${REPOSITORY}"
echo "Image:           ${IMAGE_NAME}"
echo "Full name:       ${FULL_NAME}"
echo ""

cd "$(dirname "$0")"

# Konfiguruj Docker auth dla Artifact Registry
echo "🔐 Konfiguruję Docker auth dla Artifact Registry..."
gcloud auth configure-docker ${LOCATION}-docker.pkg.dev --quiet

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
echo "🚀 PUSH DO ARTIFACT REGISTRY"
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
echo "✅ Wszystkie obrazy wypchnięte do Artifact Registry!"
echo ""

# Pobierz digesty
echo "════════════════════════════════════════════════════════════════"
echo "📝 DIGESTY OBRAZÓW"
echo "════════════════════════════════════════════════════════════════"
echo ""

for VERSION in "v1.0.0" "v1.1.0" "v2.0.0"; do
    echo "Version: ${VERSION}"
    DIGEST=$(docker inspect ${FULL_NAME}:${VERSION} --format='{{index .RepoDigests 0}}' 2>/dev/null || echo "N/A")
    echo "  ${DIGEST}"
    echo ""
done

echo "════════════════════════════════════════════════════════════════"
echo "📝 NASTĘPNE KROKI"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1. Sprawdź obrazy w konsoli:"
echo "   https://console.cloud.google.com/artifacts/docker/${PROJECT_ID}/${LOCATION}/${REPOSITORY}"
echo ""
echo "2. Listuj obrazy z CLI:"
echo "   gcloud artifacts docker images list ${LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}"
echo ""
echo "3. Dodaj do renovate-test.yaml:"
echo "   - ${FULL_NAME}:v1.0.0"
echo ""
echo "4. Skonfiguruj Renovate z dostępem do prywatnego registry"
echo ""
echo "5. Uruchom Renovate - wykryje update do v2.0.0!"
echo ""
echo "════════════════════════════════════════════════════════════════"
