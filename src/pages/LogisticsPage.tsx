import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceProviders } from '@/components/ServiceProviders';

/**
 * Logistics & Services dashboard — all service-provider request cards
 * (Transporters, Lab & Equipment, Oxygen Supply, Resources/Inputs, …) in one
 * place. Linked from the home "Logistics" module.
 */
export default function LogisticsPage() {
  useEffect(() => { document.title = 'Logistics & Services — Aqua Rudra'; }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <ServiceProviders />
      </main>
      <Footer />
    </div>
  );
}
