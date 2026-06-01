import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, MessageSquare, Plus, ChevronRight, Ticket, FileText } from 'lucide-react';
import { MobileTopBar, MobileTabBar } from '@/components/mobile/MobileChrome';

export default function ExpertPage() {
  useEffect(() => { document.title = 'Talk to an Expert — Aqua Rudra'; }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <MobileTopBar title="Talk to an Expert" />

      <main className="max-w-md mx-auto px-6 pt-8 pb-28">
        {/* Illustration */}
        <div className="flex justify-center">
          <div className="relative w-56 h-56 rounded-3xl bg-teal-50 flex items-center justify-center">
            <Stethoscope className="w-24 h-24 text-teal-600" strokeWidth={1.4} />
            <div className="absolute top-6 right-6 bg-white rounded-2xl rounded-tr-sm shadow-sm p-2">
              <MessageSquare className="w-6 h-6 text-teal-500" />
            </div>
            <div className="absolute bottom-7 right-9 bg-teal-500 rounded-full p-1.5 shadow">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Blurb */}
        <p className="mt-7 text-center text-lg text-neutral-700 leading-relaxed">
          Our Experts are here to help you in Shrimp Culture farming. Click
          “Request Help” to raise an issue.
        </p>

        {/* Request Help */}
        <Link
          to="/contact?reason=expert-help"
          className="mt-7 block text-center rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold py-4 text-lg active:scale-[0.99] transition"
        >
          Request Help
        </Link>

        <hr className="my-7 border-neutral-200" />

        {/* Links */}
        <div className="space-y-4">
          <ExpertRow to="/contact?reason=tickets" icon={Ticket} label="All Tickets" />
          <ExpertRow to="/knowledge" icon={FileText} label="View Prescription" />
        </div>
      </main>

      <MobileTabBar active="rx" />
    </div>
  );
}

function ExpertRow({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-2xl bg-neutral-100 px-5 py-5 active:bg-neutral-200 transition"
    >
      <Icon className="w-5 h-5 text-neutral-500 shrink-0" />
      <span className="flex-1 text-lg font-medium">{label}</span>
      <ChevronRight className="w-5 h-5 text-rose-600" />
    </Link>
  );
}
