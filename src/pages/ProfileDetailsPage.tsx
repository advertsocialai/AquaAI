import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Pencil, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type Pond = { id: string; name: string; area_sqm: number | null; depth_m: number | null };
type ProfileRow = {
  full_name: string | null; dob: string | null; location: string | null;
  mobile: string | null; ponds_count: number | null;
  village: string | null; mandal: string | null; district: string | null;
  state: string | null; pincode: string | null;
  latitude: number | null; longitude: number | null;
  alt_mobile: string | null; kyc_id: string | null; gender: string | null;
};

/* Label + value block, matching the original profile layout. */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-base text-neutral-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-neutral-900">{value}</div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-lg text-neutral-700 shrink-0">{children}</span>
      <span className="flex-1 h-px bg-neutral-200" />
    </div>
  );
}

export default function ProfileDetailsPage() {
  const { t } = useTranslation();
  useEffect(() => { document.title = 'Profile — Aqua Rudra'; }, []);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [ponds, setPonds] = useState<Pond[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  // Load the live profile + pond rows for the signed-in user.
  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;
    (async () => {
      const [{ data: p }, { data: pd }] = await Promise.all([
        supabase.from('profiles').select('full_name,dob,location,mobile,ponds_count,village,mandal,district,state,pincode,latitude,longitude,alt_mobile,kyc_id,gender').eq('id', user.id).maybeSingle(),
        supabase.from('profile_ponds').select('id,name,area_sqm,depth_m').eq('profile_id', user.id).order('created_at'),
      ]);
      if (cancelled) return;
      setProfile(p as ProfileRow | null);
      setPonds((pd as Pond[] | null) ?? []);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
      </div>
    );
  }

  // Prefer the live profile row; fall back to auth metadata while it loads.
  const m = user.user_metadata ?? {};
  const name = profile?.full_name || (m.name as string | undefined) || user.email?.split('@')[0] || t('profileDetailsPage.memberFallback');
  const pondsCount = String(profile?.ponds_count ?? ponds.length ?? 0);
  const dob = profile?.dob || (m.dob as string | undefined) || '---';
  const location = profile?.location || (m.location as string | undefined) || '---';
  const mobile = profile?.mobile || (user.phone ? `${user.phone}` : (m.mobile as string | undefined)) || '---';
  const village = profile?.village || '---';
  const mandal = profile?.mandal || '---';
  const district = profile?.district || (m.district as string | undefined) || '---';
  const stateName = profile?.state || '---';
  const pincode = profile?.pincode || '---';
  const coords =
    profile?.latitude != null && profile?.longitude != null
      ? `${profile.latitude.toFixed(5)}, ${profile.longitude.toFixed(5)}`
      : '---';
  const LANG_LABELS: Record<string, string> = { en: t('profileDetailsPage.langEnglish'), te: t('profileDetailsPage.langTelugu'), hi: t('profileDetailsPage.langHindi') };
  const language = LANG_LABELS[(m.lang as string) ?? ''] ?? '---';
  const whatsapp = profile?.alt_mobile || '---';
  const gender = profile?.gender ? profile.gender[0].toUpperCase() + profile.gender.slice(1) : '---';
  const kyc = profile?.kyc_id?.trim();
  const kycMasked = kyc ? `•••• •••• ${kyc.slice(-4)}` : '---';

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} aria-label={t('profileDetailsPage.back')} className="p-1 -ml-1">
              <ChevronLeft className="w-7 h-7 text-neutral-900" />
            </button>
            <h1 className="text-2xl font-bold">{t('profileDetailsPage.title')}</h1>
          </div>
          <Link to="/profile/edit" className="inline-flex items-center gap-2 text-rose-600 font-semibold">
            <Pencil className="w-5 h-5" /> {t('profileDetailsPage.editProfile')}
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-4 pb-28 space-y-7">
        <SectionHeader>{t('profileDetailsPage.personalDetails')}</SectionHeader>

        <Field label={t('profileDetailsPage.fullName')} value={name} />

        <div className="grid grid-cols-2 gap-6">
          <Field label={t('profileDetailsPage.noOfPonds')} value={pondsCount} />
          <Field label={t('profileDetailsPage.dateOfBirth')} value={dob} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label={t('profileDetailsPage.mobile')} value={mobile} />
          <Field label={t('profileDetailsPage.whatsappAlternate')} value={whatsapp} />
          <Field label={t('profileDetailsPage.gender')} value={gender} />
          <Field label={t('profileDetailsPage.preferredLanguage')} value={language} />
        </div>

        <Field label={t('profileDetailsPage.aadhaarKyc')} value={kycMasked} />

        <SectionHeader>{t('profileDetailsPage.location')}</SectionHeader>

        <Field label={t('profileDetailsPage.address')} value={location} />

        <div className="grid grid-cols-2 gap-6">
          <Field label={t('profileDetailsPage.village')} value={village} />
          <Field label={t('profileDetailsPage.mandal')} value={mandal} />
          <Field label={t('profileDetailsPage.district')} value={district} />
          <Field label={t('profileDetailsPage.state')} value={stateName} />
          <Field label={t('profileDetailsPage.pincode')} value={pincode} />
          <Field label={t('profileDetailsPage.gps')} value={coords} />
        </div>

        <SectionHeader>{t('profileDetailsPage.pondTankDetails')}</SectionHeader>

        {ponds.length === 0 ? (
          <p className="text-neutral-400">{t('profileDetailsPage.noPondsYet')}</p>
        ) : (
          <div className="space-y-3">
            {ponds.map((p) => (
              <div key={p.id} className="rounded-2xl border border-neutral-200 p-4">
                <div className="text-lg font-semibold text-neutral-900">{p.name}</div>
                <div className="mt-0.5 text-sm text-neutral-500">
                  {[p.area_sqm != null && `${p.area_sqm} m²`, p.depth_m != null && t('profileDetailsPage.depthDeep', { depth: p.depth_m })]
                    .filter(Boolean).join(' · ') || t('profileDetailsPage.noSizeDetails')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
