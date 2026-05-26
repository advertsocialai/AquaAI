#!/usr/bin/env bash
# Aqua AI mobile release build script.
#
#   ./scripts/release.sh android   → builds an AAB for Play Store upload
#   ./scripts/release.sh ios       → builds an IPA for App Store Connect
#   ./scripts/release.sh both      → both
#
# Pre-reqs:
#   - flutter SDK >= 3.22
#   - Android: android/key.properties with the signing keystore
#   - iOS: Apple Developer cert + provisioning profile installed on the Mac
set -euo pipefail

cd "$(dirname "$0")/.."

target="${1:-both}"
api_base="${API_BASE:-https://api.aquai.in/api/v1}"
flutter --version
flutter pub get

if [[ "$target" == "android" || "$target" == "both" ]]; then
    echo "▸ Building Android AAB (API_BASE=$api_base)"
    flutter build appbundle \
        --release \
        --dart-define=API_BASE="$api_base" \
        --obfuscate \
        --split-debug-info=build/symbols/android
    echo "AAB → build/app/outputs/bundle/release/app-release.aab"
fi

if [[ "$target" == "ios" || "$target" == "both" ]]; then
    if [[ "$(uname)" != "Darwin" ]]; then
        echo "iOS release requires macOS." >&2
        exit 2
    fi
    echo "▸ Building iOS IPA (API_BASE=$api_base)"
    flutter build ipa \
        --release \
        --dart-define=API_BASE="$api_base" \
        --obfuscate \
        --split-debug-info=build/symbols/ios \
        --export-options-plist=ios/ExportOptions.plist
    echo "IPA → build/ios/ipa/aquaai_mobile.ipa"
fi
