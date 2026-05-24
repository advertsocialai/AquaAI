#!/usr/bin/env bash
# AquaI mobile bootstrap. Run once per machine to materialise the
# platform folders (ios/ and android/) that the Flutter project
# needs but that we don't commit.
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v flutter >/dev/null 2>&1; then
  echo "Flutter not found. Install from https://docs.flutter.dev/get-started/install"
  exit 1
fi

echo "[1/4] flutter doctor"
flutter doctor

echo "[2/4] materialise ios/ + android/ platform folders"
flutter create --platforms=ios,android --org in.aquai --project-name aquaai_mobile .

echo "[3/4] flutter pub get"
flutter pub get

echo "[4/4] build runner (drift + riverpod codegen)"
dart run build_runner build --delete-conflicting-outputs || true

cat <<'EONOTE'

Next:
  - Open ios/Runner.xcworkspace in Xcode and set the team + bundle id
  - Open android/app/build.gradle and set applicationId in.aquai.mobile
  - Run on a simulator:
      flutter run -d ios
      flutter run -d android
  - Set the API base for the dev build:
      flutter run --dart-define=API_BASE=http://10.0.2.2:8000/api/v1

EONOTE
