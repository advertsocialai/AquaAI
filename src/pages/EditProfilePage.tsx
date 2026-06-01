import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Crosshair, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { MobileBackBar } from '@/components/mobile/MobileChrome';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PROFILE_ROLES, INDIAN_STATES, DISTRICTS_BY_STATE } from '@/data/india';

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'te', label: 'Telugu' },
  { value: 'hi', label: 'Hindi' },
  { value: 'kn', label: 'Kannada' },
  { value: 'ta', label: 'Tamil' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'bn', label: 'Bengali' },
  { value: 'or', label: 'Odia' },
];

function Labeled({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-base text-neutral-500">
        {label}{required && <span className="text-rose-600"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  'w-full rounded-2xl border border-neutral-200 bg-white py-3.5 px-4 text-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40';
const triggerClass =
  'w-full rounded-2xl border border-neutral-200 bg-white py-3.5 px-4 h-auto text-lg data-[placeholder]:text-neutral-400';

export default function EditProfilePage() {
  useEffect(() => { document.title = 'Edit Profile — Aqua Rudra'; }, []);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [roleSel, setRoleSel] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [gender, setGender] = useState('');
  const [kycId, setKycId] = useState('');
  const [pincode, setPincode] = useState('');
  const [mandal, setMandal] = useState('');
  const [lang, setLang] = useState('en');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user || !supabase) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name,dob,mobile,location,village,mandal,district,state,pincode,latitude,longitude,alt_mobile,kyc_id,gender,avatar_url,email,role')
        .eq('id', user.id)
        .maybeSingle();
      if (cancelled) return;
      const m = user.user_metadata ?? {};
      setFullName(data?.full_name ?? (m.name as string) ?? '');
      setAddress(data?.location ?? (m.location as string) ?? '');
      setEmail(data?.email ?? user.email ?? '');
      setVillage(data?.village ?? '');
      setRoleSel(data?.role ?? '');
      setStateName(data?.state ?? '');
      setDistrict(data?.district ?? (m.district as string) ?? '');
      setDob(data?.dob ?? (m.dob as string) ?? '');
      setMobile(data?.mobile ?? user.phone ?? (m.mobile as string) ?? '');
      setAltMobile(data?.alt_mobile ?? '');
      setGender(data?.gender ?? '');
      setKycId(data?.kyc_id ?? (m.kyc_ref as string) ?? '');
      setPincode(data?.pincode ?? '');
      setMandal(data?.mandal ?? '');
      setLang((m.lang as string) ?? 'en');
      setAvatarUrl(data?.avatar_url ?? '');
      setLat(data?.latitude ?? null);
      setLng(data?.longitude ?? null);
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [user]);

  function onStateChange(v: string) {
    setStateName(v);
    // Reset district when the new state has a defined list that excludes it.
    const list = DISTRICTS_BY_STATE[v];
    if (list && !list.includes(district)) setDistrict('');
  }

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

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user || !supabase) return;
    if (!file.type.startsWith('image/')) { toast.error('Please choose an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB.'); return; }
    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) { setUploading(false); toast.error('Upload failed. Please try again.'); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
    setUploading(false);
    toast.success('Photo updated.');
  }

  async function handleResetPassword() {
    if (!supabase) return;
    if (!user?.email) { navigate('/forgot-password'); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    toast[error ? 'error' : 'success'](
      error ? 'Could not send reset link.' : `Password reset link sent to ${user.email}.`,
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !supabase) return;
    if (!fullName.trim()) { toast.error('Please enter your name.'); return; }
    setSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName.trim(),
      location: address.trim() || null,
      email: email.trim() || null,
      village: village.trim() || null,
      role: roleSel || null,
      state: stateName || null,
      district: district.trim() || null,
      dob: dob || null,
      mobile: mobile.trim() || null,
      alt_mobile: altMobile.trim() || null,
      gender: gender || null,
      kyc_id: kycId.trim() || null,
      pincode: pincode.trim() || null,
      mandal: mandal.trim() || null,
      latitude: lat,
      longitude: lng,
      avatar_url: avatarUrl || null,
    });
    await supabase.auth.updateUser({ data: { lang, name: fullName.trim() } });
    setSaving(false);
    if (error) { toast.error('Could not save. Please try again.'); return; }
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
  const districtList = DISTRICTS_BY_STATE[stateName];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <MobileBackBar title="Edit Profile" />

      <form onSubmit={handleSave} className="max-w-md mx-auto px-5 pt-4 pb-28 space-y-6">
        {/* Identity */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-28 h-28 rounded-2xl bg-muted overflow-hidden flex items-center justify-center active:scale-[0.98] transition"
            aria-label="Change profile photo"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-rose-600">{fullName.trim().charAt(0).toUpperCase() || 'A'}</span>
            )}
            <span className="absolute bottom-0 inset-x-0 bg-black/45 text-white flex items-center justify-center gap-1 py-1.5 text-xs">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              {uploading ? 'Uploading' : 'Edit'}
            </span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          <div className="mt-3 text-2xl font-bold">{fullName || 'Your name'}</div>
          {mobile && <div className="text-neutral-500">{mobile}</div>}
          <button type="button" onClick={handleResetPassword} className="mt-1 text-rose-600 font-medium hover:underline">
            Reset Password
          </button>
        </div>

        {/* Core fields */}
        <Labeled label="Enter name" required>
          <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
        </Labeled>

        <Labeled label="Enter address" required>
          <textarea className={`${inputClass} min-h-[80px] resize-none`} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" />
        </Labeled>

        <Labeled label="Email">
          <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter a valid email (Optional)" />
        </Labeled>

        <Labeled label="City/Village/Town Name" required>
          <input className={inputClass} value={village} onChange={(e) => setVillage(e.target.value)} placeholder="City/Village/Town Name" />
        </Labeled>

        <Labeled label="Select role" required>
          <Select value={roleSel} onValueChange={setRoleSel}>
            <SelectTrigger className={triggerClass}><SelectValue placeholder="Please select role" /></SelectTrigger>
            <SelectContent>
              {PROFILE_ROLES.map((r) => <SelectItem key={r} value={r} className="text-lg py-3">{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </Labeled>

        <Labeled label="Select state" required>
          <Select value={stateName} onValueChange={onStateChange}>
            <SelectTrigger className={triggerClass}><SelectValue placeholder="Please select state" /></SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((s) => <SelectItem key={s} value={s} className="text-lg py-3">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Labeled>

        <Labeled label="Select the district" required>
          {districtList ? (
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className={triggerClass}><SelectValue placeholder="Please select district" /></SelectTrigger>
              <SelectContent>
                {districtList.map((d) => <SelectItem key={d} value={d} className="text-lg py-3">{d}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : (
            <input className={inputClass} value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Enter district" />
          )}
        </Labeled>

        {/* Additional details */}
        <h2 className="text-lg text-neutral-700 pt-2">More details</h2>

        <div className="grid grid-cols-2 gap-4">
          <Labeled label="Date of Birth">
            <input type="date" className={inputClass} value={dob} onChange={(e) => setDob(e.target.value)} />
          </Labeled>
          <Labeled label="Mobile">
            <input type="tel" inputMode="numeric" className={inputClass} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile number" />
          </Labeled>
          <Labeled label="WhatsApp / Alternate">
            <input type="tel" inputMode="numeric" className={inputClass} value={altMobile} onChange={(e) => setAltMobile(e.target.value)} placeholder="WhatsApp number" />
          </Labeled>
          <Labeled label="Gender">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className={triggerClass}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male" className="text-lg py-3">Male</SelectItem>
                <SelectItem value="female" className="text-lg py-3">Female</SelectItem>
                <SelectItem value="other" className="text-lg py-3">Other</SelectItem>
              </SelectContent>
            </Select>
          </Labeled>
          <Labeled label="Mandal">
            <input className={inputClass} value={mandal} onChange={(e) => setMandal(e.target.value)} placeholder="Mandal" />
          </Labeled>
          <Labeled label="Pincode">
            <input inputMode="numeric" maxLength={6} className={inputClass} value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit PIN" />
          </Labeled>
        </div>

        <Labeled label="Aadhaar / KYC ID">
          <input inputMode="numeric" className={inputClass} value={kycId} onChange={(e) => setKycId(e.target.value)} placeholder="Aadhaar / KYC reference" />
        </Labeled>

        <Labeled label="Preferred Language">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className={triggerClass}><SelectValue /></SelectTrigger>
            <SelectContent>
              {LANG_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value} className="text-lg py-3">{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Labeled>

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
