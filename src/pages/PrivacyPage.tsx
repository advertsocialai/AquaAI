import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Legal entity behind the Aqua Rudra brand. [FILL] markers are values to be
// completed with the registered company details before this policy is relied on.
const COMPANY_LEGAL = "[Company Legal Name]";
const CIN = "[CIN]";
const ADDRESS = "[Address]";
const CITY = "[City]";
const GRIEVANCE_OFFICER = "[Grievance Officer Name]";
const GRIEVANCE_EMAIL = "grievance@aquarudra.com";
const PRIVACY_EMAIL = "privacy@aquarudra.com";
const GRIEVANCE_PHONE = "[phone]";
const LAST_UPDATED = "5 June 2026";

const Section = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <section className="scroll-mt-32">
    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
      <span className="text-foreground/40 mr-2 tabular-nums">{n}.</span>{title}
    </h2>
    <div className="space-y-3 text-foreground/80 leading-relaxed">{children}</div>
  </section>
);

const Bullets = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-2 pl-1">
    {items.map((it, i) => (
      <li key={i} className="flex gap-2.5">
        <span className="text-teal-400 mt-1.5 shrink-0">•</span>
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const PrivacyPage = () => {
  useEffect(() => { document.title = "Privacy Policy — Aqua Rudra"; }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-4 text-foreground/80 mb-12 leading-relaxed">
          <p>
            Aqua Rudra helps aquaculture farmers, hatcheries, traders and their partners screen seed
            and samples, count post-larvae, grade water and issue verifiable quality certificates.
            Because this happens at the pondside — with your photos, your location and records you may
            show a bank or buyer — we treat your data as something held in trust. This policy is
            written under India&rsquo;s Digital Personal Data Protection Act, 2023 (&ldquo;DPDP
            Act&rdquo;). You are the Data Principal; we are the Data Fiduciary.
          </p>
          <p className="text-foreground/70">
            <strong>Who we are:</strong> {COMPANY_LEGAL} ({CIN}), registered office at {ADDRESS},
            Andhra Pradesh, India — &ldquo;Aqua Rudra&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;. The
            Service covers our website, web app and mobile apps.
          </p>
        </div>

        <div className="space-y-10">
          <Section n={1} title="What we collect, and why">
            <Bullets
              items={[
                <><strong>Identity:</strong> name, mobile number, preferred language and role (farmer, hatchery, trader, exporter, bank) — to run and secure your account and show the right tools.</>,
                <><strong>Pond location:</strong> with permission, your pond/hatchery GPS and district/mandal — for maps, area context and certificate origin. Most core features work without precise location.</>,
                <><strong>Scans:</strong> photos of seed, shrimp or water samples and the results we derive — counts, live/dead, size, stage, water grade and disease screening signals. Screening is a triage aid, not a diagnosis.</>,
                <><strong>Records &amp; certificates:</strong> your scan history, certificates and verification QR codes; and any invoice/batch detail you enter for a mismatch check.</>,
                <><strong>Payments:</strong> if you pay through the Service, a licensed provider handles it — we receive confirmation only and do not store full card or bank-account numbers.</>,
                <><strong>Device &amp; technical:</strong> app version, logs, error reports, connection status and a device identifier used to sync your offline data.</>,
              ]}
            />
          </Section>

          <Section n={2} title="Working offline">
            <p>
              Your core scans and records are first created and stored on your device, so you can work
              with no signal. They sync to your account when a connection returns. If you uninstall
              before syncing, that local data is lost with the app.
            </p>
          </Section>

          <Section n={3} title="AI processing of your images">
            <p>
              To turn a photo into a result, your image may be processed by automated models — some on
              your device, and for the richer result, by a third-party AI processing provider acting on
              our instructions. That provider is not permitted to use your images to train its own
              models or for its own purposes. We send the minimum needed and do not attach your name or
              contact details to the image.
            </p>
          </Section>

          <Section n={4} title="Improving our models — with consent">
            <p>
              We use your scan images to improve our own models only where you have given consent,
              working with images separated from your identity wherever feasible. You can withdraw this
              consent anytime in settings without losing access to the Service.
            </p>
          </Section>

          <Section n={5} title="How we use your data">
            <p>
              To run the Service and return results; generate and verify certificates; sync offline
              records; secure your account and detect fraud or abuse; provide support and service
              messages; build area-level and quality insights; meet legal obligations; and, with
              consent, improve our models. We do not make solely automated decisions with significant
              effects on you without a human in the loop.
            </p>
          </Section>

          <Section n={6} title="When data is shared — and when it never is">
            <p>
              You control your certificates: the data inside one is shared with a buyer, bank or insurer
              only when you choose to share its QR code or link. Otherwise we share data only with:
            </p>
            <Bullets
              items={[
                <>processors who run parts of the Service for us (hosting, AI processing, messaging, payments), bound by contract to that purpose;</>,
                <>authorities where legally required, or to enforce our terms and protect safety; and</>,
                <>an acquiring entity in a business transfer, under protection no weaker than this policy.</>,
              ]}
            />
            <p>We do not sell your personal data and do not rent it to advertisers.</p>
          </Section>

          <Section n={7} title="Retention">
            <p>
              We keep personal data only as long as needed or as law requires. Certificates and their
              underlying records are kept while your account is active so they stay verifiable. When no
              longer needed, or on a valid erasure request, we delete or anonymise the data.
            </p>
          </Section>

          <Section n={8} title="Security">
            <p>
              We use reasonable safeguards — encryption in transit, need-to-know access, secure hosting
              and authentication controls. No system is perfectly secure, but we work to protect data
              within our control and will act on, and notify, any breach as required by the DPDP Act.
            </p>
          </Section>

          <Section n={9} title="Your rights">
            <p>Under the DPDP Act you may:</p>
            <Bullets
              items={[
                <>access a summary of your data and how it is processed;</>,
                <>correct, complete or update inaccurate data;</>,
                <>erase data no longer needed and not legally retained;</>,
                <>withdraw consent (including for model improvement) as easily as you gave it;</>,
                <>nominate someone to exercise your rights; and</>,
                <>raise a grievance with us and, if unsatisfied, with the Data Protection Board of India.</>,
              ]}
            />
            <p>
              Contact our Grievance Officer (below) to exercise these. We may verify your identity
              first.
            </p>
          </Section>

          <Section n={10} title="Children">
            <p>
              The Service is intended for adults running aquaculture operations and is not directed at
              children under 18. We do not knowingly collect a child&rsquo;s data without verifiable
              parental or guardian consent as required by the DPDP Act.
            </p>
          </Section>

          <Section n={11} title="Governing law">
            <p>
              This policy is governed by the laws of India; the courts at {CITY}, Andhra Pradesh have
              jurisdiction, subject to the dispute-resolution terms in our Terms of Use.
            </p>
          </Section>

          <Section n={12} title="Grievance Officer & contact">
            <p>
              {GRIEVANCE_OFFICER} — Aqua Rudra, {COMPANY_LEGAL}
              <br />
              {ADDRESS}, Andhra Pradesh, India · Email:{" "}
              <a href={`mailto:${GRIEVANCE_EMAIL}`} className="text-teal-400 hover:underline">{GRIEVANCE_EMAIL}</a>{" "}
              · Phone: {GRIEVANCE_PHONE} (Mon–Sat, 10:00–18:00 IST). General privacy queries:{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-teal-400 hover:underline">{PRIVACY_EMAIL}</a>.
              We aim to acknowledge and resolve grievances within the timelines set by law.
            </p>
          </Section>

          <Section n={13} title="Changes">
            <p>
              If we change how we handle your data, we will post the updated policy here with a new date
              and flag significant changes in the app. Continued use after a change means you have seen
              the current version.
            </p>
          </Section>
        </div>

        <p className="mt-12 text-sm text-foreground/50 border-t border-border pt-6">
          Available in Telugu and other supported languages. If any version differs in meaning, contact
          us and we will clarify.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
