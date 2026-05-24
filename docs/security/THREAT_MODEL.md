# AquaI · Threat model (v0.1 — May 2026)

STRIDE walk-through per surface. Maintained alongside the OWASP checklist.

## Trust boundaries

1. **Browser ↔ web** (Cloudflare + ALB)
2. **Mobile app ↔ API** (HTTPS, JWT)
3. **API ↔ database** (VPC private subnet)
4. **API ↔ third parties** (egress-only via NAT GW)
5. **VLE laptop ↔ API** (institutional partner network)

## Surfaces & threats

### A · Authentication

| STRIDE | Threat | Mitigation |
|--------|--------|------------|
| Spoofing | Replay an old OTP | OTP expires in 5 min, single-use, bound to mobile + device fingerprint |
| Tampering | Forge a JWT | JWT signed with rotating RS256 key; 15 min TTL; refresh tokens stored hashed |
| Repudiation | "I never logged in" | Audit log per login attempt with IP + UA + result |
| DoS | OTP flooding | Rate limit 5/min/mobile and 100/hr/IP via slowapi |

### B · QC certificate

| STRIDE | Threat | Mitigation |
|--------|--------|------------|
| Tampering | Edit a downloaded PDF | HMAC-SHA256 over `{certId,batchId,qs,disease,timestamp}` in footer; verification endpoint recomputes |
| Repudiation | Hatchery denies issuing a cert | Cert ID embedded in DB row; revocation is a soft-flag, never a hard delete |
| Information disclosure | PII in cert | Only hatchery details + batch ID + GPS, no farmer Aadhaar |

### C · Marketplace + payments

| STRIDE | Threat | Mitigation |
|--------|--------|------------|
| Spoofing | Fake supplier listing | GST + MPEDA license + bank penny-drop required before listing |
| Tampering | Cart-amount manipulation | Order amount computed server-side, never trusted from client |
| Repudiation | Buyer denies order | Razorpay order id + webhook event id stored; e-invoice generated |
| Information disclosure | Card details | Razorpay handles PCI scope; we never see card data |

### D · Disease surveillance

| STRIDE | Threat | Mitigation |
|--------|--------|------------|
| Information disclosure | Individual farm location leaked | Surveillance dashboards show aggregated district-level data only |
| Tampering | False outbreak report | Reports require VLE + PCR confirmation; flagged in audit log |

### E · Mobile (offline-first)

| STRIDE | Threat | Mitigation |
|--------|--------|------------|
| Information disclosure | Lost phone | Local SQLite is encrypted via flutter_secure_storage |
| Tampering | Repackaged APK with hostile inference | Play Integrity API verified at sync time |

## Out of scope

- Insider threats from MPEDA / NSPAAD officers (their internal policy)
- Side-channel attacks on the TFLite models (low-value targets)
- Physical theft of farmer phones (PII minimised on-device)
