#!/bin/bash

# Script to set up GCP authentication for Renovate
# This script creates a service account key and exports it as an environment variable

set -e

PROJECT_ID="sap-kyma-neighbors-dev"
SA_EMAIL="renovate-sa-test@${PROJECT_ID}.iam.gserviceaccount.com"
KEY_FILE="renovate-sa-key.json"
LOCATION="europe-west3"
REPOSITORY="renovate-private-registry-test"

echo "════════════════════════════════════════════════════════════════"
echo "🔐 GCP ARTIFACT REGISTRY AUTHENTICATION SETUP FOR RENOVATE"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Project:         ${PROJECT_ID}"
echo "Service Account: ${SA_EMAIL}"
echo "Location:        ${LOCATION}"
echo "Repository:      ${REPOSITORY}"
echo ""

# Check if key file already exists
if [ -f "${KEY_FILE}" ]; then
    echo "⚠️  Key file '${KEY_FILE}' already exists."
    read -p "Do you want to create a new key? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Using existing key file."
    else
        echo "Creating new key..."
        gcloud iam service-accounts keys create ${KEY_FILE} \
            --iam-account=${SA_EMAIL} \
            --project=${PROJECT_ID}
        echo "✅ New key created: ${KEY_FILE}"
    fi
else
    echo "📥 Creating service account key..."
    gcloud iam service-accounts keys create ${KEY_FILE} \
        --iam-account=${SA_EMAIL} \
        --project=${PROJECT_ID}
    echo "✅ Key created: ${KEY_FILE}"
fi

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "🔑 Granting Artifact Registry Reader permission..."
echo "────────────────────────────────────────────────────────────────"

# Grant reader permission if not already granted
gcloud artifacts repositories add-iam-policy-binding ${REPOSITORY} \
    --location=${LOCATION} \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/artifactregistry.reader" \
    --project=${PROJECT_ID} \
    --condition=None 2>&1 | grep -E "(Updated|bindings)" || echo "✅ Permission already granted"

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "✅ SETUP COMPLETE!"
echo "────────────────────────────────────────────────────────────────"
echo ""
echo "To use with Renovate, export the environment variable:"
echo ""
echo "  export GCP_ARTIFACT_REGISTRY_KEY=\$(cat ${KEY_FILE} | jq -c .)"
echo ""
echo "Or add to your shell profile (~/.zshrc or ~/.bashrc):"
echo ""
echo "  export GCP_ARTIFACT_REGISTRY_KEY=\$(cat $(pwd)/${KEY_FILE} | jq -c .)"
echo ""
echo "Then run Renovate:"
echo ""
echo "  ./run-renovate-local.sh"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "⚠️  IMPORTANT: Add ${KEY_FILE} to .gitignore!"
echo ""

# Add to .gitignore if not already there
if ! grep -q "${KEY_FILE}" .gitignore 2>/dev/null; then
    echo "${KEY_FILE}" >> .gitignore
    echo "✅ Added ${KEY_FILE} to .gitignore"
else
    echo "✅ ${KEY_FILE} already in .gitignore"
fi

echo ""
