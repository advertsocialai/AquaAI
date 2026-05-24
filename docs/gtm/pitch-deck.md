# AquaI · Pitch deck (outline · v0.1)

Source of truth for slides. Convert to .pptx / .key after partner +
investor sign-off. Each section maps to one slide.

---

## 1. Title

**AquaI**
India's AI-powered aquaculture intelligence platform.
Decoding aquaculture, one pond at a time.

## 2. The problem

- Indian aquaculture is a ₹64,000 Cr industry losing ~₹12,000 Cr/year to disease, poor seed quality and price information asymmetry.
- 1.2M+ farmers operate without PCR-grade diagnostics or real pricing.
- EHP, WSSV and AHPND outbreaks wipe out 20-40% of crops in affected districts every season.

## 3. The insight

The data exists — in hatcheries, in PCR labs, in MPEDA reports — but it's locked in PDFs, WhatsApp messages and government portals nobody reads.

## 4. The product

A unified web + mobile platform that puts AI diagnostics, live pricing, verified marketplace, logistics, advisory and government surveillance into one role-aware dashboard for eight stakeholder types.

## 5. The wedge (vs AquaBrahma)

| Dimension      | AquaBrahma           | AquaI                                  |
|----------------|----------------------|----------------------------------------|
| Core value     | Content + community  | Operating system                       |
| Diagnostics    | Generic guides       | PCR-validated AI in 30 s               |
| Pricing        | Read-only trends     | Live transactional + reverse auctions  |
| Marketplace    | Classifieds          | KYC-verified suppliers + escrow         |
| Government     | Not addressed        | NSPAAD sync + MPEDA verification        |
| Bank           | Not addressed        | Farm-risk API for underwriting         |

## 6. The science

- YOLOv8 Nano + EfficientNetB0 + MobileNetV3 — 5 on-device TFLite models, < 15 MB total, < 500 ms inference on ₹8,000 Android.
- PCR-validated ground truth via MoU with ICAR-CIBA and NSPAAD.
- Sens > 92%, Spec > 88%, AUC > 0.95 on the EHP model.

## 7. The platform

10 modules · 8 roles · 6 languages · offline-first · MPEDA-aligned QC certificates with HMAC signature + QR verification.

Screenshots: dashboard, diagnostics, pricing, certificate.

## 8. Traction (Year 1 target)

- 50,000 farmers across AP, TN, OD, WB, GJ
- 200 hatcheries on the B2B portal
- 3 banks + 1 insurer integrated
- NSPAAD live sync

## 9. Revenue streams

- Hatchery SaaS — ₹15k/month per facility
- VLE marketplace fee — 8% of diagnostic services
- Marketplace take-rate — 2-5% on inputs + equipment
- Bank API — ₹50/farm/month for risk scoring
- Logistics — ₹200/consignment matched
- Premium farmer subscription — ₹99/month (ad-free + advisory calls)

## 10. Unit economics (target month 12)

- CAC: ₹350 per farmer
- LTV: ₹6,200 per farmer over 3 years
- Hatchery contribution margin: 78%
- Marketplace contribution margin: 35%

## 11. Team

- Founder · Chaitanya Gowtham
- (advisors slot)

## 12. Ask

- Seed: ₹6 Cr ($720k) for 18-month runway
- Use of funds: 40% engineering, 25% data partnerships + MoU compliance,
  20% field ops (VLE training + cluster onboarding), 15% reserve.

## 13. Roadmap

| Phase | Month | Milestone |
|-------|-------|-----------|
| 1     | 1-2   | Auth + onboarding + design system |
| 2     | 2-3   | Pricing engine live |
| 3     | 3-5   | All 5 AI models in production |
| 4     | 5-6   | Marketplace + checkout |
| 5     | 6-7   | Logistics + e-way bill |
| 6     | 7-8   | Crop calendar + advisory |
| 7     | 8-9   | Knowledge + community |
| 8     | 9-10  | NSPAAD / MPEDA / bank integrations |
| 9     | 10-11 | Closed beta — 20 hatcheries, 50 farmers, 10 VLEs |
| 10    | 11-12 | Public AP launch |
| 11    | Yr 2  | TN + OD + WB + GJ rollout, iOS |

## 14. Appendix slides

- Detailed AI model card per model (architecture, dataset, metrics)
- District-wise crop-loss baselines (NSPAAD 2024-25)
- Regulatory landscape (MPEDA, CAA, NSPAAD, OIE/WOAH)
- Partner letters of intent
- Patent + IP strategy
