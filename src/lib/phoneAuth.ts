/**
 * Phone-as-identity auth helpers.
 *
 * Aqua Rudra signs farmers in with their mobile number + a password. Supabase's
 * phone (SMS-OTP) provider needs a paid SMS gateway, so instead we use the
 * always-on email/password provider keyed to a deterministic alias derived from
 * the mobile number. The real email (if given) is kept in user metadata.
 *
 * The alias domain is non-routable on purpose — no mail is ever sent to it.
 */

/** Strip everything but digits and drop a leading 91 country code if present. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
}

/** Deterministic login alias for a 10-digit Indian mobile, e.g. 91XXXXXXXXXX@phone.aquarudra.app */
export function phoneToEmail(raw: string): string {
  return `91${normalizePhone(raw)}@phone.aquarudra.app`;
}
