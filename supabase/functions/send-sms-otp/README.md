# Mobile OTP via MSG91 (Send SMS Hook)

Aqua Rudra signs farmers in with **mobile + OTP** (the code sent to the phone is
the credential — no password). Supabase generates the OTP; this Edge Function
delivers it through **MSG91** (cheapest gateway for India, ~₹0.15/SMS).

Function URL:
`https://rjhysiqqwgptqiwsonvd.supabase.co/functions/v1/send-sms-otp`

## One-time setup (account owner)

1. **MSG91 + DLT (TRAI requirement — do this first, ~1–2 days):**
   - Create an MSG91 account.
   - Register a **DLT sender ID** and an **OTP template** containing an `##otp##`
     variable. Note the **Auth Key** and the **Flow/Template ID**.

2. **Supabase → Authentication → Sign In / Providers → Phone:**
   - Enable the **Phone** provider.
   - Turn ON **Enable phone confirmations**.

3. **Supabase → Authentication → Hooks → Send SMS hook:**
   - Enable it, type **HTTPS**, point it at the function URL above.
   - Copy the generated **signing secret** (`v1,whsec_…`).

4. **Supabase → Edge Functions → Secrets** (or `supabase secrets set`):
   - `MSG91_AUTHKEY` = MSG91 Auth Key
   - `MSG91_TEMPLATE_ID` = DLT-approved OTP template id
   - `SEND_SMS_HOOK_SECRET` = the signing secret from step 3

## Deploy

```bash
supabase functions deploy send-sms-otp --no-verify-jwt
```

Already deployed via the Supabase MCP (version 1, `verify_jwt = false`).

## After it's live

Tell the developer to flip the app to phone-OTP login/signup
(`signInWithOtp` / `verifyOtp`). Until then the app uses mobile + password,
which works without any SMS gateway.
