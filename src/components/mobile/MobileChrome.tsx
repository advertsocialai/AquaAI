import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronLeft, Home as HomeIcon, IndianRupee, FileText, Fish, MapPin } from 'lucide-react';

/** Top bar with a back button + title — for drill-in screens (Shop, Product…). */
export function MobileBackBar({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-100">
      <div className="max-w-md mx-auto px-5 h-16 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="Back" className="p-1 -ml-1">
          <ChevronLeft className="w-7 h-7 text-neutral-900" />
        </button>
        <span className="text-2xl font-bold text-neutral-900">{title}</span>
      </div>
    </header>
  );
}

/** Shared top bar for the mobile app shell (Home, Market Price, …). */
export function MobileTopBar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-100">
      <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
        <span className="text-2xl font-bold text-neutral-900">{title}</span>
        <a href="tel:+919553282325" className="text-rose-600 font-bold">Call us</a>
      </div>
    </header>
  );
}

export type Tab = 'home' | 'rates' | 'rx' | 'farm' | 'map';

const TABS: { key: Tab; to: string; Icon: React.ElementType }[] = [
  { key: 'home',  to: '/home',             Icon: HomeIcon },
  { key: 'rates', to: '/rates',            Icon: IndianRupee },
  { key: 'rx',    to: '/expert',           Icon: FileText },
  { key: 'farm',  to: '/explore',          Icon: Fish },
  { key: 'map',   to: '/aquaai#dashboard', Icon: MapPin },
];

/** Shared bottom tab bar. */
export function MobileTabBar({ active }: { active: Tab }) {
  const navigate = useNavigate();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-200">
      <div className="max-w-md mx-auto px-6 h-20 grid grid-cols-5 items-center pb-2">
        {TABS.map(({ key, to, Icon }) => {
          const on = key === active;
          return (
            <button
              key={key}
              onClick={() => navigate(to)}
              className="flex items-center justify-center"
              aria-current={on ? 'page' : undefined}
            >
              <Icon className={`w-7 h-7 ${on ? 'text-rose-600' : 'text-neutral-400'}`} fill={on ? 'currentColor' : 'none'} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
