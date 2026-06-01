import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fish, Image, Lightbulb, HeartPulse, ArrowRight, Store } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { MobileTopBar, MobileTabBar } from '@/components/mobile/MobileChrome';

/* ── Small inline icons not in lucide ─────────────────────────────── */
function ShrimpIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 7c-3 0-4 2-7 2H7a4 4 0 0 0 0 8h6c4 0 6-3 6-6" />
      <path d="M7 17c-2 0-4-1-4-3" />
      <path d="M19 7c1-1 1-3 0-4" />
      <circle cx="16" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}
function FeedBagIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 4c0 2-2 2-2 5 0 6 1 11 6 11s6-5 6-11c0-3-2-3-2-5" />
      <path d="M8 4h8" />
      <path d="M10 11a2 2 0 0 0 4 0" />
      <path d="M11.5 13.5h1" />
    </svg>
  );
}

/* ── Card tile (Market rates / Knowledge / Tools) ─────────────────── */
function Tile({
  to, label, gradient, Icon, tall = false,
}: { to: string; label: string; gradient: string; Icon: React.ElementType; tall?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-2xl p-5 bg-gradient-to-br ${gradient} active:scale-[0.98] transition ${
        tall ? 'min-h-[140px]' : 'min-h-[104px]'
      }`}
    >
      <Icon className={`text-neutral-800 shrink-0 ${tall ? 'w-11 h-11' : 'w-9 h-9'}`} strokeWidth={1.6} />
      <span className="text-lg font-bold leading-tight text-neutral-900">{label}</span>
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-medium text-neutral-700 mb-3">{children}</h2>;
}

export default function HomePage() {
  useEffect(() => { document.title = 'Home — Aqua Rudra'; }, []);
  const { user } = useAuth();
  const kycDone = Boolean(user?.user_metadata?.kyc_ref);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <MobileTopBar title="Home" />

      <main className="max-w-md mx-auto px-5 pt-5 pb-28 space-y-8">
        {/* KYC banner */}
        {!kycDone && (
          <div className="rounded-2xl p-5 bg-gradient-to-br from-sky-500 to-teal-400 text-white shadow-sm">
            <h2 className="text-xl font-bold">Your profile is incomplete</h2>
            <p className="mt-1 text-white/90">Complete your KYC now to request help from our experts.</p>
            <Link
              to="/kyc"
              className="mt-4 block text-center rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
            >
              Complete KYC
            </Link>
          </div>
        )}

        {/* Market rates */}
        <section>
          <SectionTitle>Market rates</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Tile to="/rates" label="Shrimp Rates" Icon={ShrimpIcon} gradient="from-[#f4a99b] to-[#f8cfc6]" />
            <Tile to="/rates?tab=fish" label="Fish Rates" Icon={Fish} gradient="from-[#f6b8d0] to-[#fbdce8]" />
          </div>
        </section>

        {/* Aqua Knowledge */}
        <section>
          <SectionTitle>Aqua Knowledge</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Tile to="/knowledge" label="Aqua Updates" Icon={Image} gradient="from-[#a7e0cf] to-[#d6f0e4]" tall />
            <Tile to="/knowledge" label="Aqua School" Icon={Lightbulb} gradient="from-[#74c0f0] to-[#a9d8f6]" tall />
          </div>
        </section>

        {/* Aqua Tools */}
        <section>
          <SectionTitle>Aqua Tools</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Tile to="/aquaai#dashboard" label="Survival Calculator" Icon={HeartPulse} gradient="from-[#d6edb6] to-[#e8f4d4]" />
            <Tile to="/aquaai#dashboard" label="Feed Calculator" Icon={FeedBagIcon} gradient="from-[#fbe6a6] to-[#fdf3d0]" />
          </div>
        </section>

        {/* Shop Farm */}
        <section>
          <SectionTitle>Shop Farm</SectionTitle>
          <Link
            to="/shop"
            className="block rounded-2xl p-6 bg-gradient-to-br from-[#d7eebb] to-[#eaf5d8] active:scale-[0.99] transition relative overflow-hidden"
          >
            <div className="max-w-[62%]">
              <h3 className="text-xl font-bold">Shop Farm Products</h3>
              <p className="mt-2 text-neutral-700 leading-snug">
                Shop your aquaculture needs including selling your shrimp at your
                farm gate now with Shop@Farm
              </p>
              <ArrowRight className="w-6 h-6 mt-6 text-neutral-900" />
            </div>
            <Store className="absolute right-4 bottom-6 w-28 h-28 text-teal-600/70" strokeWidth={1.2} />
          </Link>
        </section>

        {/* Know about diseases */}
        <section>
          <SectionTitle>Know about diseases</SectionTitle>
          <div className="rounded-2xl p-6 bg-white border border-neutral-200 shadow-sm">
            <h3 className="text-xl font-bold">Disease Map</h3>
            <p className="mt-2 text-neutral-700 leading-snug">
              Shrimp and Fish culture are often prone to diseases on a frequent
              basis. Such issues need to be solved at the earliest. Disease Map
              keeps you updated on all the diseases and locations nearest to you.
            </p>
            <Link
              to="/aquaai#dashboard"
              className="mt-5 block text-center rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
            >
              Scan diseases near me
            </Link>
          </div>
        </section>
      </main>

      <MobileTabBar active="home" />
    </div>
  );
}
