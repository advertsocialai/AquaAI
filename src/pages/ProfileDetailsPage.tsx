import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Pencil, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

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
  useEffect(() => { document.title = 'Profile — Aqua Rudra'; }, []);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
      </div>
    );
  }

  const m = user.user_metadata ?? {};
  const name = (m.name as string | undefined) || user.email?.split('@')[0] || 'Member';
  const ponds = String(m.ponds ?? m.pond_count ?? 0);
  const dob = (m.dob as string | undefined) || '---';
  const location = (m.location as string | undefined) || '---';
  const mobile = user.phone ? `${user.phone}` : ((m.mobile as string | undefined) || '---');

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} aria-label="Back" className="p-1 -ml-1">
              <ChevronLeft className="w-7 h-7 text-neutral-900" />
            </button>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <Link to="/settings" className="inline-flex items-center gap-2 text-rose-600 font-semibold">
            <Pencil className="w-5 h-5" /> Edit Profile
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-4 pb-28 space-y-7">
        <SectionHeader>Personal Details</SectionHeader>

        <Field label="Full Name" value={name} />

        <div className="grid grid-cols-2 gap-6">
          <Field label="No Of Ponds/Tanks" value={ponds} />
          <Field label="Date of Birth" value={dob} />
        </div>

        <Field label="Location" value={location} />
        <Field label="Mobile" value={mobile} />

        <SectionHeader>Pond/Tank Details</SectionHeader>

        {Number(ponds) > 0 ? null : (
          <p className="text-neutral-400">No ponds/tanks added yet.</p>
        )}
      </main>
    </div>
  );
}
