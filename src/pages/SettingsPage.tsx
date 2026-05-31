import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminModule } from '@/components/dashboard/AdminModule';
import { RoleSelector, type Role } from '@/components/dashboard/RoleSelector';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  useEffect(() => { document.title = 'Settings — AquaI'; }, []);
  const [role, setRole] = useState<Role>('farmer');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="pt-28 pb-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-card">
              <SettingsIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-foreground/30">Account</div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>
          </div>

          <div className="mb-6 p-4 rounded-xl border border-border bg-card">
            <div className="text-[11px] uppercase tracking-widest text-foreground/30 mb-3">Active role context</div>
            <RoleSelector role={role} onChange={setRole} />
          </div>

          <AdminModule role={role} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
