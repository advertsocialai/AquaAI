import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const LAST_UPDATED = "28 May 2026";
const CONTACT_EMAIL = "support@aquaai.in";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-32">
    <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3">{title}</h2>
    <div className="space-y-3 text-foreground/80">{children}</div>
  </section>
);

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

        <p className="text-foreground/80 mb-12 leading-relaxed">
          This Privacy Policy explains how AquaRudra (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses
          and protects your information when you use the AquaRudra mobile app and the
          website at <a href="https://aquaai.in" className="underline underline-offset-4 hover:text-foreground/70">aquaai.in</a>.
          {" "}If you have questions, write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 hover:text-foreground/70">{CONTACT_EMAIL}</a>.
        </p>

        <div className="space-y-10 text-sm md:text-base leading-relaxed">
          <Section id="who" title="1. Who this policy applies to">
            <p>
              Anyone who downloads or uses the AquaRudra Android or iOS app, signs in
              to aquaai.in, or interacts with our APIs.
            </p>
          </Section>

          <Section id="collect" title="2. What we collect">
            <h3 className="font-semibold text-foreground">Information you give us</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account details — email, phone (for OTP), full name, role, state, district, preferred language.</li>
              <li>Farm profile — pond / cage / RAS details you choose to add: species, stocking date, area, salinity range.</li>
              <li>KYC documents — if you opt in to verified certificates, an Aadhaar or government ID number and a selfie. KYC is optional; you can use most of the app without it.</li>
              <li>Diagnostic photos — pictures of shrimp, fish, water samples or seed trays that you capture inside the app.</li>
              <li>Support messages — anything you send via in-app chat or to {CONTACT_EMAIL}.</li>
            </ul>

            <h3 className="font-semibold text-foreground pt-2">Information we collect automatically</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Device info — Android version, screen size, model (for crash diagnostics).</li>
              <li>Approximate location — derived from your district selection or, if you grant permission, from device GPS. Used only for weather and nearby marketplace listings.</li>
              <li>App usage — which modules you open and basic interaction events. We do not record screen content.</li>
              <li>Push notification token — assigned by Firebase Cloud Messaging when you enable notifications.</li>
            </ul>

            <h3 className="font-semibold text-foreground pt-2">What we do NOT collect</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>We do not access your contacts, SMS, call logs, calendar or photo gallery beyond pictures you explicitly capture inside the app.</li>
              <li>We do not record audio in the background.</li>
              <li>We do not collect precise GPS location unless you explicitly grant the foreground &quot;while using the app&quot; permission for a specific feature.</li>
            </ul>
          </Section>

          <Section id="use" title="3. How we use your information">
            <ul className="list-disc pl-6 space-y-1">
              <li>Run on-device and server AI diagnostics on the photos you submit.</li>
              <li>Generate and verify certificates that include the photos and data you provided.</li>
              <li>Send push notifications you have opted in to (weather alerts, certificate updates, support messages).</li>
              <li>Show you a localized experience (language, units, region-specific advisories).</li>
              <li>Reply to support requests.</li>
              <li>Investigate crashes and improve the app.</li>
              <li>Comply with applicable Indian regulations (FSSAI / MPEDA traceability, where you opt in).</li>
            </ul>
            <p>We do <strong>not</strong> use your data for ad targeting and we do <strong>not</strong> sell it.</p>
          </Section>

          <Section id="storage" title="4. Where your data is stored">
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase (Postgres)</strong> — your account, farm profile, certificates and diagnostic logs. Row-level security enforced.</li>
              <li><strong>AWS S3</strong> — diagnostic photos and certificate PDFs, encrypted at rest.</li>
              <li><strong>Firebase Cloud Messaging (Google)</strong> — push notification routing only.</li>
              <li><strong>Backend AWS App Runner (Mumbai region)</strong> — application servers.</li>
            </ul>
            <p>All data in transit is encrypted via HTTPS / TLS 1.2 or higher.</p>
          </Section>

          <Section id="share" title="5. Who we share with">
            <p>We share data only with these processors who help us run the service:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Supabase — database hosting</li>
              <li>AWS — file storage and backend compute</li>
              <li>Google Firebase — push notification delivery</li>
              <li>SendGrid — transactional emails (OTP, password reset, certificate ready)</li>
            </ul>
            <p>We do not share your data with advertisers, data brokers or social networks. We disclose data to government authorities only when legally compelled.</p>
          </Section>

          <Section id="retention" title="6. How long we keep it">
            <ul className="list-disc pl-6 space-y-1">
              <li>Account data — until you delete your account (see Section 7).</li>
              <li>Diagnostic photos — until you delete them from your farm log or delete your account.</li>
              <li>Crash and analytics logs — 90 days, then deleted.</li>
              <li>Support messages — 18 months.</li>
            </ul>
          </Section>

          <Section id="rights" title="7. Your rights">
            <p>You can, at any time:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Access</strong> the data we hold on you (in-app: Profile → Export my data).</li>
              <li><strong>Correct</strong> mistakes (Profile → Edit details).</li>
              <li><strong>Delete</strong> your account and all associated data (Profile → Delete account). Backups are purged within 30 days.</li>
              <li><strong>Withdraw consent</strong> for push notifications (Settings → Notifications) or location (Settings → Permissions).</li>
              <li><strong>Object</strong> to a specific use by emailing {CONTACT_EMAIL}.</li>
            </ul>
            <p>If you are in the EEA, UK, or California, you have additional statutory rights — contact us and we will honour them.</p>
          </Section>

          <Section id="children" title="8. Children">
            <p>
              AquaRudra is intended for users aged 16 and above. We do not knowingly collect
              personal information from anyone under 16. If you believe a minor has registered,
              write to {CONTACT_EMAIL} and we will delete the account.
            </p>
          </Section>

          <Section id="changes" title="9. Changes to this policy">
            <p>
              We may update this policy when we add features or our processors change. The
              &quot;Last updated&quot; date at the top reflects the current version. Material
              changes will be announced via in-app banner and email at least 30 days before
              they take effect.
            </p>
          </Section>

          <Section id="contact" title="10. Contact">
            <p>AquaRudra</p>
            <p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 hover:text-foreground/70">{CONTACT_EMAIL}</a>
            </p>
            <p className="text-sm text-muted-foreground pt-3">
              Grievance Officer (as required by India&apos;s Information Technology Rules, 2011):
              contact {CONTACT_EMAIL} for the current named officer.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
