# Aqua Rudra

India's AI-powered aquaculture intelligence platform. Web app (Vite + React + Tailwind + shadcn/ui), Flutter mobile app (Android-first, iOS-ready), and FastAPI backend with PostGIS / Redis.

## Repo layout

```
/                  Web app (Vite + React + TypeScript)
  src/             Source
    components/    Shared UI + dashboard modules
      dashboard/   14 role-aware dashboard modules
    pages/         Top-level routes (/, /aquaai, /login, /signup, /settings, ...)
    services/      Typed API service layer (mock-first, swap flag for real backend)
    hooks/         React hooks (WebSocket price ticker, etc.)
    locales/       i18n strings — en, te, ta, hi, od, bn
    lib/           i18n init, utilities
    test/          Vitest test suite (20+ tests, jsdom)
backend/           FastAPI service
  app/api/v1/      Routers — auth, diagnostics, pricing, marketplace, logistics,
                   advisory, knowledge, community, surveillance, ws ticker, ...
  Dockerfile       Multi-stage Python 3.11 image, non-root user, healthcheck
mobile/            Flutter app (Android + iOS via flutter create)
  lib/screens/     auth · home · pricing · marketplace · advisory · chat · ...
data/pricing/      CSV seed data for prawn / freshwater / marine species
.github/workflows/ GitHub Actions CI
docker-compose.yml postgres + redis + backend + web for local dev
Dockerfile         Web app — nginx:alpine SPA
```

## Quick start (web only)

```bash
npm install
npm run dev          # http://localhost:8080
```

## Quick start (full stack)

```bash
docker compose up -d --build
# Postgres → :5432, Redis → :6379
# FastAPI  → http://localhost:8000  (Swagger: /docs)
# Web      → http://localhost:5173
```

## Tests

```bash
npm test                 # watch mode
npm run test:run         # one-shot
npm run test:coverage    # with v8 coverage report
```

CI runs the same on every push to `main` / `acqua-ai`.

## Mobile

The Flutter project lives in `mobile/`. To materialise iOS / Android platform folders the first time:

```bash
cd mobile
flutter create --platforms=ios,android .
flutter pub get
flutter run -d <android-emulator|ios-simulator>
```

## Branding & i18n

- Six languages: English, Telugu (default for AP), Tamil, Hindi, Odia, Bengali
- Switcher in the top-right of the site header; persisted to `localStorage` under `aquai-lang`
- Add strings to `src/locales/<code>.json` and use `useTranslation()` in components

## Backend → frontend wiring

Frontend talks to the backend only via `src/services/api.ts`. Mocks are returned by default. To swap to the real FastAPI:

1. Set `VITE_API_BASE=https://api.your-domain.in/api/v1` in `.env.local`
2. Flip `USE_STUBS = false` in `src/services/api.ts`
3. Implement / extend the matching routers under `backend/app/api/v1/`

## Status vs the AquaI master prompts

This repo is **a working scaffold**, not a production deployment. UI for all 10 web modules and 4 of the spec's 6 mobile modules is in. The pieces that are NOT done (and will not be done from a single coding session) are listed in the project tracking — they include: ML model training to spec accuracy, real auth (Firebase / Aadhaar e-KYC / NSDL), live data feeds (MPEDA / NSPAAD / IMD / Razorpay / GST), Kubernetes / Terraform infrastructure, penetration testing, professional Telugu / Tamil translation, and the full 12-month phased rollout.
