// Supabase Edge Function: weather-alerts
// Runs hourly. For each farmer with a mobile number + location, checks the next
// 12 hours of weather and, if rain/thunderstorm is incoming, sends an SMS +
// WhatsApp alert via Twilio. De-dupes via public.weather_alert_log (6h window).
//
// Required secrets (set with `supabase secrets set ...`):
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM, TWILIO_WHATSAPP_FROM
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are injected automatically.
//
// India compliance: SMS needs a DLT-registered template/sender; WhatsApp needs
// a Meta-approved template. Keep ALERT_TEXT in sync with your approved template.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// District centroids — fallback when a profile has no lat/long of its own.
const DISTRICT_COORDS: Record<string, [number, number]> = {
  'Srikakulam': [18.30, 83.90], 'Visakhapatnam': [17.69, 83.22], 'Anakapalli': [17.69, 83.00],
  'Kakinada': [16.96, 82.24], 'Konaseema': [16.58, 82.00], 'East Godavari': [16.96, 82.0],
  'West Godavari': [16.54, 81.52], 'Eluru': [16.71, 81.10], 'Krishna': [16.19, 81.14],
  'Bapatla': [15.90, 80.47], 'Guntur': [16.30, 80.45], 'Prakasam': [15.50, 80.05],
  'Nellore': [14.44, 79.99], 'SPSR Nellore': [14.44, 79.99],
};

const norm91 = (m: string): string | null => {
  const digits = (m || '').replace(/\D/g, '');
  const ten = digits.slice(-10);
  return /^[6-9]\d{9}$/.test(ten) ? `+91${ten}` : null;
};

// WMO codes → rain / thunderstorm.
function classify(code: number): 'thunderstorm' | 'rain' | null {
  if (code >= 95) return 'thunderstorm';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  return null;
}

async function twilioSend(channel: 'sms' | 'whatsapp', to: string, body: string) {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = channel === 'sms'
    ? Deno.env.get('TWILIO_SMS_FROM')
    : Deno.env.get('TWILIO_WHATSAPP_FROM');
  if (!sid || !token || !from) return { ok: false, detail: 'twilio secrets missing' };

  const toAddr = channel === 'whatsapp' ? `whatsapp:${to}` : to;
  const fromAddr = channel === 'whatsapp' && !from.startsWith('whatsapp:') ? `whatsapp:${from}` : from;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${sid}:${token}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: toAddr, From: fromAddr, Body: body }),
  });
  const detail = await res.text();
  return { ok: res.ok, detail: detail.slice(0, 300) };
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Farmers with a mobile number.
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, mobile, latitude, longitude, district, mandal, full_name')
    .not('mobile', 'is', null);

  let checked = 0, alerted = 0;
  const now = Date.now();

  for (const p of profiles ?? []) {
    const phone = norm91(p.mobile as string);
    if (!phone) continue;

    let lat = p.latitude as number | null;
    let lng = p.longitude as number | null;
    if (lat == null || lng == null) {
      const c = DISTRICT_COORDS[(p.district as string) ?? ''];
      if (!c) continue;
      [lat, lng] = c;
    }
    checked++;

    // De-dupe: skip if we already alerted this farmer in the last 6 hours.
    const since = new Date(now - 6 * 3600_000).toISOString();
    const { data: recent } = await supabase
      .from('weather_alert_log')
      .select('id').eq('profile_id', p.id).eq('ok', true).gte('created_at', since).limit(1);
    if (recent && recent.length) continue;

    // Next 12h forecast.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&hourly=weather_code,precipitation_probability&forecast_days=2` +
      `&timezone=Asia%2FKolkata&models=best_match&cell_selection=land`;
    let bad: { kind: 'rain' | 'thunderstorm'; time: string } | null = null;
    try {
      const j = await (await fetch(url)).json();
      const times: string[] = j.hourly?.time ?? [];
      const codes: number[] = j.hourly?.weather_code ?? [];
      for (let i = 0; i < times.length; i++) {
        const ts = new Date(times[i]).getTime();
        if (ts < now || ts > now + 12 * 3600_000) continue;
        const kind = classify(codes[i]);
        if (kind) { bad = { kind, time: times[i] }; break; }
      }
    } catch { continue; }

    if (!bad) continue;

    const when = new Date(bad.time).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
    });
    const place = (p.mandal as string) || (p.district as string) || 'your area';
    const label = bad.kind === 'thunderstorm' ? 'Thunderstorms' : 'Rain';
    // Keep this in sync with your approved DLT/WhatsApp template.
    const text = `Aqua Rudra alert: ${label} expected near ${place} around ${when} today. ` +
      `Secure your pond, check aerators and reduce feeding. Stay safe.`;

    for (const channel of ['sms', 'whatsapp'] as const) {
      const r = await twilioSend(channel, phone, text);
      await supabase.from('weather_alert_log').insert({
        profile_id: p.id, mobile: phone, kind: bad.kind, message: text, channel,
        ok: r.ok, detail: r.detail,
      });
      if (r.ok) alerted++;
    }
  }

  return new Response(JSON.stringify({ ok: true, checked, alerted }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
