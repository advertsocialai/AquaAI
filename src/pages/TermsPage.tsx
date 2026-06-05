import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const COMPANY_LEGAL = "Miledeep Works Private Limited";
const WEBSITE = "www.miledeepworks.in";
const LAST_UPDATED = "1 June 2026";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="scroll-mt-32">
    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{title}</h2>
    <div className="space-y-3 text-foreground/80">{children}</div>
  </section>
);

const Clause = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <p className="leading-relaxed">
    <span className="text-foreground/50 mr-2 tabular-nums">{n}</span>
    {children}
  </p>
);

const TermsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{t('termsPage.title')}</h1>
        <p className="text-sm text-muted-foreground mb-10">{t('termsPage.lastUpdated', { date: LAST_UPDATED })}</p>

        <p className="text-foreground/80 mb-12 leading-relaxed">{t('termsPage.intro', { company: COMPANY_LEGAL })}</p>

        <div className="space-y-10 text-sm md:text-base">
          <Section title={t('termsPage.s1Title')}>
            <Clause n="1.1">{t('termsPage.s1c1', { website: WEBSITE })}</Clause>
            <Clause n="1.2">{t('termsPage.s1c2')}</Clause>
            <Clause n="1.3">{t('termsPage.s1c3')}</Clause>
            <Clause n="1.4">{t('termsPage.s1c4')}</Clause>
          </Section>

          <Section title={t('termsPage.s2Title')}>
            <Clause n="2.1">{t('termsPage.s2c1')}</Clause>
            <Clause n="2.2">{t('termsPage.s2c2')}</Clause>
            <Clause n="2.2.1">{t('termsPage.s2c2a')}</Clause>
            <Clause n="2.2.2">{t('termsPage.s2c2b')}</Clause>
            <Clause n="2.2.3">{t('termsPage.s2c2c')}</Clause>
            <Clause n="2.2.4">{t('termsPage.s2c2d')}</Clause>
            <Clause n="2.2.5">{t('termsPage.s2c2e')}</Clause>
            <Clause n="2.3">{t('termsPage.s2c3')}</Clause>
            <Clause n="2.4">{t('termsPage.s2c4')}</Clause>
            <Clause n="2.5">{t('termsPage.s2c5')}</Clause>
          </Section>

          <Section title={t('termsPage.s3Title')}>
            <Clause n="3.1">{t('termsPage.s3c1')}</Clause>
            <Clause n="3.1.1">{t('termsPage.s3c1a')}</Clause>
            <Clause n="3.1.2">{t('termsPage.s3c1b')}</Clause>
          </Section>

          <Section title={t('termsPage.s4Title')}>
            <Clause n="4.1">{t('termsPage.s4c1')}</Clause>
            <Clause n="4.2">{t('termsPage.s4c2')}</Clause>
            <Clause n="4.3">{t('termsPage.s4c3')}</Clause>
            <Clause n="4.4">{t('termsPage.s4c4')}</Clause>
            <Clause n="4.5">{t('termsPage.s4c5')}</Clause>
            <Clause n="4.6">{t('termsPage.s4c6')}</Clause>
          </Section>

          <Section title={t('termsPage.s5Title')}>
            <Clause n="5.1">{t('termsPage.s5c1')}</Clause>
            <Clause n="5.2">{t('termsPage.s5c2')}</Clause>
            <Clause n="5.3">
              {t('termsPage.s5c3Pre')} <Link to="/privacy" className="underline underline-offset-4 hover:text-foreground/70">{t('termsPage.s5c3Link')}</Link> {t('termsPage.s5c3Post')}
            </Clause>
          </Section>

          <Section title={t('termsPage.s6Title')}>
            <Clause n="6.1">{t('termsPage.s6c1')}</Clause>
            <Clause n="6.2">{t('termsPage.s6c2')}</Clause>
            <Clause n="6.3">{t('termsPage.s6c3')}</Clause>
            <Clause n="6.4">{t('termsPage.s6c4')}</Clause>
          </Section>

          <Section title={t('termsPage.s7Title')}>
            <Clause n="7.1">{t('termsPage.s7c1')}</Clause>
            <Clause n="7.2">{t('termsPage.s7c2')}</Clause>
            <Clause n="7.3">{t('termsPage.s7c3')}</Clause>
            <Clause n="7.4">{t('termsPage.s7c4')}</Clause>
            <Clause n="7.5">{t('termsPage.s7c5')}</Clause>
            <Clause n="7.6">{t('termsPage.s7c6')}</Clause>
          </Section>

          <Section title={t('termsPage.s8Title')}>
            <Clause n="8.1">{t('termsPage.s8c1')}</Clause>
            <Clause n="8.1.1">{t('termsPage.s8c1a')}</Clause>
            <Clause n="8.1.2">{t('termsPage.s8c1b')}</Clause>
            <Clause n="8.1.3">{t('termsPage.s8c1c')}</Clause>
            <Clause n="8.1.4">{t('termsPage.s8c1d')}</Clause>
            <Clause n="8.2">{t('termsPage.s8c2')}</Clause>
          </Section>

          <Section title={t('termsPage.s9Title')}>
            <Clause n="9.1">{t('termsPage.s9c1')}</Clause>
            <Clause n="9.2">{t('termsPage.s9c2')}</Clause>
            <Clause n="9.3">{t('termsPage.s9c3')}</Clause>
            <Clause n="9.4">{t('termsPage.s9c4')}</Clause>
          </Section>

          <Section title={t('termsPage.s10Title')}>
            <Clause n="10.1">{t('termsPage.s10c1')}</Clause>
          </Section>

          <Section title={t('termsPage.s11Title')}>
            <Clause n="11.1">{t('termsPage.s11c1')}</Clause>
            <Clause n="11.2">{t('termsPage.s11c2')}</Clause>
            <Clause n="11.3">{t('termsPage.s11c3')}</Clause>
            <Clause n="11.4">{t('termsPage.s11c4')}</Clause>
            <Clause n="11.5">{t('termsPage.s11c5')}</Clause>
            <Clause n="11.6">{t('termsPage.s11c6')}</Clause>
          </Section>

          <Section title={t('termsPage.s12Title')}>
            <Clause n="12.1">{t('termsPage.s12c1')}</Clause>
            <Clause n="12.2">{t('termsPage.s12c2')}</Clause>
            <Clause n="12.3">{t('termsPage.s12c3')}</Clause>
            <Clause n="12.4">{t('termsPage.s12c4')}</Clause>
          </Section>

          <Section title={t('termsPage.s13Title')}>
            <Clause n="13.1">{t('termsPage.s13c1')}</Clause>
          </Section>

          <Section title={t('termsPage.s14Title')}>
            <Clause n="14.1">{t('termsPage.s14c1')}</Clause>
          </Section>

          <Section title={t('termsPage.s15Title')}>
            <Clause n="15.1">{t('termsPage.s15c1')}</Clause>
            <Clause n="15.2">{t('termsPage.s15c2')}</Clause>
            <Clause n="15.3">{t('termsPage.s15c3')}</Clause>
            <Clause n="15.4">{t('termsPage.s15c4')}</Clause>
            <Clause n="15.5">{t('termsPage.s15c5')}</Clause>
          </Section>

          <Section title={t('termsPage.s16Title')}>
            <Clause n="16.1">{t('termsPage.s16c1')}</Clause>
          </Section>

          <Section title={t('termsPage.s17Title')}>
            <Clause n="17.1">{t('termsPage.s17c1')}</Clause>
            <Clause n="17.2">{t('termsPage.s17c2')}</Clause>
            <Clause n="17.3">{t('termsPage.s17c3')}</Clause>
            <Clause n="17.4">{t('termsPage.s17c4')}</Clause>
            <Clause n="17.5">{t('termsPage.s17c5')}</Clause>
            <Clause n="17.6">{t('termsPage.s17c6')}</Clause>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
