# Play Console — Data Safety form answers

Reference doc for filling in the Play Console "Data safety" section.
Match each answer to the Play Console form exactly; this is the official disclosure to users.

## Section 1 — Data collection and security

**Does your app collect or share any of the required user data types?** → **Yes**

**Is all of the user data collected by your app encrypted in transit?** → **Yes**
(Justification: app talks to backend only over HTTPS / TLS 1.2+.)

**Do you provide a way for users to request that their data be deleted?** → **Yes**
(Justification: Profile → Delete account inside the app; or email support@aquaai.in.)

---

## Section 2 — Data types collected

For each row below: **Collected** = Yes (you'll be asked Shared / Required / Purposes).

| Data type | Collected? | Shared with third parties? | Required or Optional? | Purpose(s) |
|---|---|---|---|---|
| Name | Yes | No | Required | Account management |
| Email address | Yes | No | Required | Account management, Communications |
| User ID | Yes | No | Required | Account management, Analytics |
| Phone number | Yes | No | Required | Account management (OTP auth) |
| Address (district + state only) | Yes | No | Required | App functionality (weather, marketplace) |
| Photos | Yes | No | Optional | App functionality (diagnostics, certificates) |
| Approximate location | Yes | No | Optional | App functionality (weather) |
| Precise location | No | — | — | — |
| Audio | No | — | — | — |
| Files & docs | No | — | — | — |
| Calendar events | No | — | — | — |
| Contacts | No | — | — | — |
| App activity (in-app actions, in-app search history) | Yes | No | Required | Analytics, App functionality |
| App info and performance (crash logs, diagnostics) | Yes | No | Required | Analytics |
| Device or other IDs (FCM token) | Yes | No | Required | App functionality (push notifications) |
| Government ID (Aadhaar) | Yes | No | Optional | App functionality (KYC for verified certificates only) |
| Health info | No | — | — | — |
| Financial info | No | — | — | — |
| Race / ethnicity | No | — | — | — |
| Political / religious views | No | — | — | — |
| Sexual orientation / gender identity | No | — | — | — |

---

## Section 3 — Security practices

- **Data is encrypted in transit** → Yes
- **Users can request data deletion** → Yes (in-app + email)

---

## Section 4 — Privacy policy URL

`https://aquaai.in/privacy`
