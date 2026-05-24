# AquaI · OWASP Top 10 (2021) self-audit

Tick-list reviewed before every production deploy. Re-run after any
auth, payment or file-upload change. Items marked **[ ]** are open.

| # | Risk                                | Status | Mitigation in repo |
|---|-------------------------------------|--------|--------------------|
| 1 | Broken access control               | partial | FastAPI Users + JWT 15min; RBAC matrix in `src/components/dashboard/AquaDashboard.tsx` ROLE_ACCESS. **[ ]** Server-side enforcement of ROLE_ACCESS per endpoint still required. |
| 2 | Cryptographic failures              | done | TLS 1.3 via cert-manager + ALB; column-level encryption for Aadhaar/GST planned in Postgres; HMAC-SHA256 cert signing in `src/lib/qcCertificate.ts`. |
| 3 | Injection (SQL / OS / LDAP)         | done | SQLAlchemy parametrised queries; Pydantic validators on all inputs (`backend/app/api/v1/kyc.py`). |
| 4 | Insecure design                     | partial | Threat model in `docs/security/THREAT_MODEL.md`. **[ ]** Annual review by external firm. |
| 5 | Security misconfiguration           | done | Distroless-style base images; `runAsNonRoot: true` in `infra/k8s/20-backend.yaml`; secrets via `Secret` not `ConfigMap`. |
| 6 | Vulnerable + outdated components    | done | `.github/workflows/security.yml` runs `npm audit`, `pip-audit`, `Snyk` (when token set) and Trivy weekly. |
| 7 | Identification + auth failures      | partial | OTP-first login, rate-limit on `/auth/*` via slowapi. **[ ]** Replay-protection on OTP, geo-velocity checks. |
| 8 | Software + data integrity failures  | partial | SHA-256 HMAC on QC certs; PWA service worker checks bundle integrity. **[ ]** Sigstore on container images. |
| 9 | Security logging + monitoring       | partial | Sentry for errors (`src/lib/sentry.ts`); `/metrics` for Prometheus. **[ ]** Centralised audit log to Loki. |
| 10 | Server-side request forgery (SSRF) | done | All external HTTP calls go through `backend/app/integrations/*.py` which target fixed hostnames. No user-supplied URLs. |

## Annual external pen test

Required before public launch. Vendors shortlisted:
- NII Consulting
- Trustwave SpiderLabs
- Lucideus

Scope: web app (aquai.in), API (api.aquai.in), mobile binary,
infrastructure (EKS, RDS, ALB).

## Disclosure policy

Reports to `security@aquai.in`. Bug bounty (when funded): payments
via Razorpay X with CVSS-bucketed tiers (Low ₹2k, Med ₹10k, High ₹50k,
Critical ₹2L).
