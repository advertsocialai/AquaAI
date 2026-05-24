/**
 * Sentry init. Off by default. To enable:
 *   1. Set VITE_SENTRY_DSN in .env.local to your project DSN
 *   2. Optionally set VITE_SENTRY_ENV (production / staging / development)
 *
 * Without a DSN this is a no-op so dev builds stay quiet and no events
 * leak to a placeholder project.
 */
import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const ENV = (import.meta.env.VITE_SENTRY_ENV as string | undefined) ?? import.meta.env.MODE;

export function initSentry() {
  if (!DSN) return;
  Sentry.init({
    dsn: DSN,
    environment: ENV,
    tracesSampleRate: ENV === 'production' ? 0.2 : 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Scrub PII fields before sending.
      const pii = ['aadhaar', 'gst', 'bank_account', 'mobile', 'otp'];
      if (event.request?.data && typeof event.request.data === 'object') {
        for (const key of pii) {
          if (key in (event.request.data as Record<string, unknown>)) {
            (event.request.data as Record<string, unknown>)[key] = '[redacted]';
          }
        }
      }
      return event;
    },
  });
}

export { Sentry };
