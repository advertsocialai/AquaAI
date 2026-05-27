# Aqua AI · Mobile (Flutter)

Android-first, iOS-ready Flutter app for India's aquaculture intelligence platform.

> **Looking to install on your phone right now?** Skip this README and read
> [Install on iPhone or Android](#install-on-iphone-or-android) below — the
> Aqua AI PWA works on both today, no developer setup needed.

---

## Install on iPhone or Android

You have three ways to get Aqua AI on a phone today. Pick what fits.

### Option A — Install the PWA (free, works on iOS + Android, no App Store)

This is the recommended path for farmers, VLEs and field staff. No Apple
Developer fee, no Play Console listing, no waiting for review. Works offline
once installed.

**On iPhone (Safari only — Chrome and Firefox on iOS do not support PWA install):**

1. Open <https://aquaai.in> in Safari
2. Tap the Share button at the bottom (the square with the up arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** in the top-right corner
5. The Aqua AI icon appears on your home screen — tap to launch full-screen

The site auto-shows a banner with these steps the first time you visit on
iOS Safari. Dismiss it with the × — it stays hidden for 30 days.

**On Android (Chrome, Edge, Brave, Samsung Internet):**

1. Open <https://aquaai.in> in your browser
2. The browser shows an "Install Aqua AI" banner — tap **Install**
3. Or use the browser menu → **Add to Home Screen** / **Install app**
4. The icon appears in your app drawer

**What works once installed:**

- Full offline mode (the service worker caches articles, pricing, marketplace,
  diagnostics outputs)
- Camera access for QC sample capture
- Push notifications (iOS 16.4+ / Android 5+)
- Voice reader in 6 Indian languages
- Home-screen icon + splash, runs full-screen like a native app
- Cert-verify QR scanner

**What doesn't:**

- Background sync (foreground only on iOS Safari)
- Apple Sign-in (use mobile OTP instead — it's the primary path anyway)

### Option B — Sideload the Flutter build to your own iPhone (free, 7 days)

For internal demos. Needs a Mac with Xcode + a free Apple ID.

```bash
cd mobile
./scripts/bootstrap.sh     # materialises ios/ + android/ folders
cd ios
open Runner.xcworkspace    # opens Xcode
```

In Xcode:
1. Click the **Runner** target → **Signing & Capabilities**
2. Set **Team** to your free Apple ID (Personal Team)
3. Set **Bundle Identifier** to something unique e.g. `in.aquai.mobile.dev`
4. Plug in your iPhone, select it from the device list
5. Click ▶ **Run**

Limitations of a free Apple ID:
- Certificate expires after 7 days — reinstall via Xcode to refresh
- Maximum 3 sideloaded apps per Apple ID
- One device per dev account
- IPA cannot be shared with other devices

### Option C — Sign + publish to the App Store / Play Store

This is the long-term distribution path. Costs:

- **Apple Developer Program**: $99 / year — required for TestFlight + App Store
- **Google Play Console**: $25 one-time — required for Play Store

With those accounts in place:

```bash
cd mobile
./scripts/release.sh android   # → build/app/outputs/bundle/release/app-release.aab
./scripts/release.sh ios       # → build/ios/ipa/aquaai_mobile.ipa
```

Upload the AAB to Play Console → Internal Testing track first, then
production. Upload the IPA to App Store Connect via Transporter → TestFlight,
then submit for review.

---

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
