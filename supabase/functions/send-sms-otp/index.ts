// Supabase "Send SMS Hook" — delivers the Supabase-generated OTP via MSG91.
//
// Wire-up (Supabase dashboard):
//   1. Authentication -> Sign In / Providers -> Phone: enable the Phone provider
//      and turn ON "Enable phone confirmations".
//   2. Authentication -> Hooks -> "Send SMS hook": set to this Edge Function
//      (HTTPS). Copy the generated signing secret.
//   3. Edge Functions -> Secrets, set:
//        MSG91_AUTHKEY        - your MSG91 Auth Key
//        MSG91_TEMPLATE_ID    - DLT-approved OTP flow template id (var: ##otp##)
//        SEND_SMS_HOOK_SECRET - the signing secret from step 2 (v1,whsec_...)
//
// India note: the MSG91 template + sender id must be DLT-registered (TRAI).
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

interface HookPayload {
  user?: { phone?: string };
  sms?: { otp?: string };
}

Deno.serve(async (req) => {
  try {
    const raw = await req.text();

    // Verify the webhook signature when the secret is configured.
    let payload: HookPayload;
    const secret = Deno.env.get("SEND_SMS_HOOK_SECRET");
    if (secret) {
      const base64 = secret.replace(/^v1,?/, "").replace(/^whsec_/, "");
      const wh = new Webhook(base64);
      const headers: Record<string, string> = {};
      req.headers.forEach((v, k) => (headers[k] = v));
      payload = wh.verify(raw, headers) as HookPayload;
    } else {
      payload = JSON.parse(raw) as HookPayload;
    }

    const phone = payload.user?.phone;
    const otp = payload.sms?.otp;
    if (!phone || !otp) {
      return new Response(JSON.stringify({ error: "missing phone or otp" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const authkey = Deno.env.get("MSG91_AUTHKEY");
    const template_id = Deno.env.get("MSG91_TEMPLATE_ID");
    if (!authkey || !template_id) {
      return new Response(JSON.stringify({ error: "MSG91 secrets not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // MSG91 expects a bare national/international number without the leading '+'.
    const mobiles = phone.replace(/^\+/, "");

    const res = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: { "Content-Type": "application/json", authkey },
      body: JSON.stringify({
        template_id,
        short_url: "0",
        recipients: [{ mobiles, otp }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return new Response(JSON.stringify({ error: `msg91 ${res.status}: ${detail}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
});
