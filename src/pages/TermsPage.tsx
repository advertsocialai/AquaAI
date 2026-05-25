import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="space-y-10 text-sm leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the Aqua AI website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Use of Services</h2>
            <p>Our services are provided for informational and research collaboration purposes. You agree to use them only for lawful purposes and in accordance with these terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Intellectual Property</h2>
            <p>All content, research, data, and materials on this website are the property of Aqua AI or its licensors and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Disclaimer</h2>
            <p>The information provided on this website is for general informational purposes only and does not constitute medical advice. Our research and products are subject to regulatory approval and should not be used as a substitute for professional medical guidance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
            <p>Aqua AI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Contact</h2>
            <p>For questions about these Terms of Service, contact us at <a href="mailto:support@aquai.in" className="text-foreground underline underline-offset-4 hover:text-foreground/70 transition-colors">support@aquai.in</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
