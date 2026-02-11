#!/bin/bash

# Uruchom Renovate tylko dla renovate-test.yaml
# Użycie: ./run-renovate-test.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEST_FILE="test-image/renovate-test.yaml"

echo "════════════════════════════════════════════════════════════════"
echo "🔄 RENOVATE TEST - tylko ${TEST_FILE}"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Sprawdź czy plik istnieje
if [ ! -f "${SCRIPT_DIR}/${TEST_FILE}" ]; then
    echo "❌ Błąd: ${TEST_FILE} nie istnieje!"
    exit 1
fi

# Sprawdź czy plik jest tracked przez git
if ! git ls-files --error-unmatch "${TEST_FILE}" > /dev/null 2>&1; then
    echo "⚠️  ${TEST_FILE} nie jest tracked przez git!"
    echo "Dodaję do git..."
    git add "${TEST_FILE}"
    echo "✅ Dodano do git"
    echo ""
fi

echo "📝 Skanowany plik: ${TEST_FILE}"
echo "🐋 Obrazy w pliku:"
grep -E "^\s*-\s+[a-z0-9]" "${SCRIPT_DIR}/${TEST_FILE}" | sed 's/^  - /   • /' || echo "   (nie znaleziono)"
echo ""

echo "────────────────────────────────────────────────────────────────"
echo "🚀 Uruchamiam Renovate..."
echo "────────────────────────────────────────────────────────────────"
echo ""

docker run --rm \
    -v "${SCRIPT_DIR}:/usr/src/app" \
    -e LOG_LEVEL=debug \
    -e RENOVATE_CONFIG_FILE=/usr/src/app/renovate.json \
    renovate/renovate:latest \
        --platform=local \
        --dry-run=full \
        --include-paths="${TEST_FILE}"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ GOTOWE!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📋 Sprawdź powyżej czy Renovate wykrył updaty:"
echo "   • v1.0.0 → v2.0.0"
echo "   • v1.1.0 → v2.0.0"
echo "   • nowe digesty"
echo ""
