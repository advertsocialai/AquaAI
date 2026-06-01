import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Crosshair } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { MobileBackBar } from '@/components/mobile/MobileChrome';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'te', label: 'Telugu' },
  { value: 'hi', label: 'Hindi' },
];

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-base text-neutral-500">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  'w-full rounded-2xl border border-neutral-200 bg-white py-3.5 px-4 text-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40';

export default function EditProfilePage() {
  useEffect(() => { document.title = 'Edit Profile — Aqua Rudra'; }, []);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [lang, setLang] = useState('en');
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [mandal, setMandal] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  // Pre-fill from the live profile row (falling back to auth metadata).
  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name,dob,mobile,location,village,mandal,district,state,pincode,latitude,longitude')
        .eq('id', user.id)
        .maybeSingle();
      if (cancelled) return;
      const m = user.user_metadata ?? {};
      setFullName(data?.full_name ?? (m.name as string) ?? '');
      setDob(data?.dob ?? (m.dob as string) ?? '');
      setMobile(data?.mobile ?? user.phone ?? (m.mobile as string) ?? '');
      setLang((m.lang as string) ?? 'en');
      setAddress(data?.location ?? (m.location as string) ?? '');
      setVillage(data?.village ?? '');
      setMandal(data?.mandal ?? '');
      setDistrict(data?.district ?? (m.district as string) ?? '');
      setStateName(data?.state ?? '');
      setPincode(data?.pincode ?? '');
      setLat(data?.latitude ?? null);
      setLng(data?.longitude ?? null);
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [user]);

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      toast.error('Location is not supported on this device.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
        toast.success('Location captured.');
      },
      () => {
        setLocating(false);
        toast.error('Could not get your location. Allow location access and try again.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !supabase) return;
    if (!fullName.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName.trim(),
      dob: dob || null,
      mobile: mobile.trim() || null,
      location: address.trim() || null,
      village: village.trim() || null,
      mandal: mandal.trim() || null,
      district: district.trim() || null,
      state: stateName.trim() || null,
      pincode: pincode.trim() || null,
      latitude: lat,
      longitude: lng,
    });
    // Keep the preferred language on the auth user too (used app-wide).
    await supabase.auth.updateUser({ data: { lang, name: fullName.trim() } });
    setSaving(false);
    if (error) {
      toast.error('Could not save. Please try again.');
      return;
    }
    toast.success('Profile updated.');
    navigate('/profile/details');
  }

  if (loading || !user || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
      </div>
    );
  }

  const coordLabel = lat != null && lng != null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : 'Not set';

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <MobileBackBar title="Edit Profile" />

      <form onSubmit={handleSave} className="max-w-md mx-auto px-5 pt-4 pb-28 space-y-6">
        <h2 className="text-lg text-neutral-700">Personal Details</h2>

        <Labeled label="Full Name">
          <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
        </Labeled>

        <div className="grid grid-cols-2 gap-4">
          <Labeled label="Date of Birth">
            <input type="date" className={inputClass} value={dob} onChange={(e) => setDob(e.target.value)} />
          </Labeled>
          <Labeled label="Mobile">
            <input type="tel" inputMode="numeric" className={inputClass} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile number" />
          </Labeled>
        </div>

        <Labeled label="Preferred Language">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 px-4 h-auto text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANG_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-lg py-3">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Labeled>

        <h2 className="text-lg text-neutral-700 pt-2">Location</h2>

        <Labeled label="Address">
          <textarea
            className={`${inputClass} min-h-[88px] resize-none`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House no., street, area"
          />
        </Labeled>

        <div className="grid grid-cols-2 gap-4">
          <Labeled label="Village">
            <input className={inputClass} value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Village" />
          </Labeled>
          <Labeled label="Mandal">
            <input className={inputClass} value={mandal} onChange={(e) => setMandal(e.target.value)} placeholder="Mandal" />
          </Labeled>
          <Labeled label="District">
            <input className={inputClass} value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District" />
          </Labeled>
          <Labeled label="State">
            <input className={inputClass} value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State" />
          </Labeled>
          <Labeled label="Pincode">
            <input inputMode="numeric" maxLength={6} className={inputClass} value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit PIN" />
          </Labeled>
        </div>

        {/* GPS capture */}
        <div className="rounded-2xl border border-neutral-200 p-4">
          <div className="flex items-center gap-2 text-neutral-700">
            <MapPin className="w-5 h-5 text-rose-600" />
            <span className="font-medium">GPS Location</span>
          </div>
          <p className="mt-1 text-sm text-neutral-500">{coordLabel}</p>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-rose-200 text-rose-600 font-semibold px-4 py-2.5 active:scale-[0.99] transition disabled:opacity-50"
          >
            {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
            Use my location
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 text-lg active:scale-[0.99] transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-5 h-5 animate-spin" />}
          Save
        </button>
      </form>
    </div>
  );
}
