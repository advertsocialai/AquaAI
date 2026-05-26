# Aqua AI · Mobile (Flutter)

Android-first, iOS-ready Flutter app for India's aquaculture intelligence platform.

## Quick start

```bash
# One-time per machine
flutter --version
./scripts/bootstrap.sh        # materialises ios/ + android/ via flutter create

# Day-to-day
cd mobile
flutter pub get
flutter run --dart-define=API_BASE=http://10.0.2.2:8000/api/v1
```

The default `API_BASE` in `lib/utils/constants.dart` already points at `10.0.2.2:8000`
(Android emulator → host localhost). For an iOS simulator, override with
`--dart-define=API_BASE=http://localhost:8000/api/v1`. For a real device on WiFi,
substitute your Mac's LAN IP.

## Platforms

| Platform | minSdk / iOS deployment | Status |
|---|---|---|
| Android | API 23 (Android 6.0) | ✅ Manifest + Gradle + signing config ready |
| iOS     | iOS 13.0             | ✅ Info.plist + AppDelegate + Podfile ready |

To produce platform folders (`ios/Runner.xcodeproj`, `android/.gradle/` etc.) the
first time, run `./scripts/bootstrap.sh` which calls `flutter create --platforms=ios,android`.

## Releasing

```bash
./scripts/release.sh android   # builds an AAB → upload to Play Console
./scripts/release.sh ios       # builds an IPA → upload to App Store Connect
./scripts/release.sh both
```

### Android signing

Create `android/key.properties` (never committed):

```
storeFile=/Users/you/keystores/aquai.jks
storePassword=…
keyAlias=aquai
keyPassword=…
```

### iOS signing

Use Apple's `Automatic` signing in Xcode for development, or set up
[Fastlane Match](https://docs.fastlane.tools/actions/match/) for production.

## Backend integration

The app talks to the Aqua AI backend exclusively through
`lib/services/api_service.dart`. The relevant entry points:

| Method | Endpoint | What |
|---|---|---|
| `listModels()` | `GET /api/v1/models` | Registry of 5 models |
| `inferSeedCount(File)` | `POST /api/v1/models/seed-counter/infer` | PL count |
| `inferDisease(File)` | `POST /api/v1/models/disease-detector/infer` | EHP / WSSV / AHPND |
| `inferQuality(File, ...)` | `POST /api/v1/models/quality-grader/infer` | Composite QS |
| `inferPlStage(File)` | `POST /api/v1/models/pl-stage-classifier/infer` | PL5-PL15 |
| `inferStress(...)` | `POST /api/v1/models/stress-forecaster/infer` | 24-72h risk |
| `downloadModel(String)` | `GET /api/v1/models/{id}/download` | OTA |

The `ServerDiagnosticsScreen` (More → AI Diagnostics) is the UI for all of these.

## Localisation

Six languages with full `.arb` files under `lib/l10n/`:

- English (default)
- Telugu (Andhra Pradesh)
- Tamil (Tamil Nadu)
- Hindi (national)
- Odia (Odisha)
- Bengali (West Bengal)

Strings are loaded at runtime via Flutter's gen-l10n (see `l10n.yaml`).
Native-speaker review is pending for production.

## Firebase

Push notifications and analytics use Firebase. Drop the generated files in once
the project is provisioned:

- `android/app/google-services.json` (template in `google-services.template.json`)
- `ios/Runner/GoogleService-Info.plist`
- `lib/firebase_options.dart` (template in `firebase_options.template.dart`)

These three paths are git-ignored.

## CI

GitHub Actions runs `flutter analyze`, `flutter test`, and builds the Android AAB
+ unsigned iOS app on every push to `main`. See `.github/workflows/mobile.yml`.

## Folder layout

```
mobile/
  android/                Native Android wrapper (Gradle 8.3, Kotlin 1.9)
  ios/                    Native iOS wrapper (CocoaPods, Swift)
  lib/
    main.dart             App entry, theme, splash → onboarding → login flow
    services/             API client, on-device AI, local DB, sync
    screens/              Home, diagnostics, pricing, marketplace, advisory,
                          chat, settings, profile, kyc, about, help, splash,
                          onboarding, auth, server_diagnostics, ...
    l10n/                 .arb locale files
    utils/                Constants, brand colors, AppInfo
  l10n.yaml               gen-l10n config
  pubspec.yaml
  scripts/
    bootstrap.sh          flutter create --platforms=ios,android
    release.sh            build AAB / IPA
```
