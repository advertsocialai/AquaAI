import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTranslation, Trans } from "react-i18next";

const COMPANY_LEGAL = "Miledeep Works Private Limited";
const COMPANY = "Miledeep";
const CONTACT_EMAIL = "privacy@miledeepworks.com";
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

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold text-foreground pt-2">{children}</h3>
);

const PrivacyPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{t('privacyPage.title')}</h1>
        <p className="text-sm text-muted-foreground mb-10">{t('privacyPage.lastUpdated', { date: LAST_UPDATED })}</p>

        <div className="space-y-4 text-foreground/80 mb-12 leading-relaxed">
          <p>
            <Trans i18nKey="privacyPage.intro1" values={{ company: COMPANY }}>
              Your privacy is of prime importance to us. We value your Personal Information that you
              share with us. We appreciate the trust you have reposed in us in doing so. Through this
              Privacy Notice we would like to inform you of the manner in which we collect and process
              your Personal Information including and not limited to professional information while
              using our websites, web applications, and/or mobile applications (&ldquo;<strong>Apps</strong>&rdquo;)
              for you to avail the services (&ldquo;<strong>Services</strong>&rdquo;) offered by our
              Company (hereinafter referred to as &ldquo;<strong>{COMPANY}</strong>&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo; or &ldquo;our&rdquo;).
            </Trans>
          </p>
          <p>
            <Trans i18nKey="privacyPage.intro2">
              The Services, so offered here, adhere to all the laws, rules, regulations and policies
              including Data Protection Laws of India (&ldquo;<strong>Applicable Laws</strong>&rdquo;)
              with regard to the collection, use, disclosure, retention, purging and protection of your
              Personal Information that our Company would have access to as a result of your use of our
              Services and consent thereto.
            </Trans>
          </p>
        </div>

        <div className="space-y-10 text-sm md:text-base">
          <Section title={t('privacyPage.s1Title')}>
            <Clause n="1.1">
              {t('privacyPage.c1_1', { companyLegal: COMPANY_LEGAL })}
            </Clause>
          </Section>

          <Section title={t('privacyPage.s2Title')}>
            <SubHeading>{t('privacyPage.s2Sub1')}</SubHeading>
            <Clause n="2.1.1">
              {t('privacyPage.c2_1_1')}
            </Clause>
            <Clause n="2.1.2">
              {t('privacyPage.c2_1_2')}
            </Clause>

            <SubHeading>{t('privacyPage.s2Sub2')}</SubHeading>
            <Clause n="2.2.1">
              <Trans i18nKey="privacyPage.c2_2_1">
                We may automatically collect and store certain types of information, including but not
                limited to usernames, passwords, and other security and usage related information, such
                as log data, analytical code, time stamp, geo stamp, IP address, version and
                identification number of the Apps and device, browser type, browser language, the date
                and time of your request, your profile, websites visited by you, search terms used, your
                mobile carrier data, platform type, number of clicks, phone number, requested status of
                other Users and various status information with regard to the Services provided through
                the Apps and / or its website (&ldquo;<strong>Usage Information</strong>&rdquo;) whenever
                you visit or utilize the Services. Such Usage Information collected is not associated with
                any Personal Data and is only tagged to the unique identifier for a particular device.
              </Trans>
            </Clause>
            <Clause n="2.2.2">
              {t('privacyPage.c2_2_2')}
            </Clause>

            <SubHeading>{t('privacyPage.s2Sub3')}</SubHeading>
            <Clause n="2.3.1">
              <Trans i18nKey="privacyPage.c2_3_1">
                We may also collect such other anonymous information that is not associated with or
                linked to any Personal Information (&ldquo;<strong>Anonymous Data</strong>&rdquo;) and
                which, by itself, does not permit the identification of any individual User. Anonymous
                Data includes without limitation, unique identifiers of the device on which website and /
                or the Apps are installed or accessed, such as VPN, information of Wi-Fi connectivity and
                such other information. We may also store this unique identifier, at many times and create
                a profile for you based on such Anonymous Data.
              </Trans>
            </Clause>
          </Section>

          <Section title={t('privacyPage.s3Title')}>
            <Clause n="3.1">
              {t('privacyPage.c3_1')}
            </Clause>
            <Clause n="3.1.1">{t('privacyPage.c3_1_1')}</Clause>
            <Clause n="3.1.2">{t('privacyPage.c3_1_2')}</Clause>
            <Clause n="3.1.3">{t('privacyPage.c3_1_3')}</Clause>
            <Clause n="3.1.4">
              {t('privacyPage.c3_1_4')}
            </Clause>
            <Clause n="3.1.5">{t('privacyPage.c3_1_5')}</Clause>
            <Clause n="3.1.6">
              {t('privacyPage.c3_1_6')}
            </Clause>
            <Clause n="3.1.7">{t('privacyPage.c3_1_7')}</Clause>
            <Clause n="3.1.8">
              {t('privacyPage.c3_1_8')}
            </Clause>
            <Clause n="3.1.9">{t('privacyPage.c3_1_9')}</Clause>
          </Section>

          <Section title={t('privacyPage.s4Title')}>
            <Clause n="4.1">{t('privacyPage.c4_1')}</Clause>
            <Clause n="4.1.1">{t('privacyPage.c4_1_1')}</Clause>
            <Clause n="4.1.2">
              {t('privacyPage.c4_1_2')}
            </Clause>
            <Clause n="4.1.3">
              {t('privacyPage.c4_1_3')}
            </Clause>
            <Clause n="4.2">
              {t('privacyPage.c4_2')}
            </Clause>
          </Section>

          <Section title={t('privacyPage.s5Title')}>
            <Clause n="5.1">
              {t('privacyPage.c5_1')}
            </Clause>
            <Clause n="5.2">
              {t('privacyPage.c5_2')}
            </Clause>
            <Clause n="5.3">
              {t('privacyPage.c5_3')}
            </Clause>
            <Clause n="5.4">
              {t('privacyPage.c5_4')}
            </Clause>
          </Section>

          <Section title={t('privacyPage.s6Title')}>
            <Clause n="6.1">
              {t('privacyPage.c6_1')}
            </Clause>
            <Clause n="6.2">
              {t('privacyPage.c6_2')}
            </Clause>
            <Clause n="6.3">{t('privacyPage.c6_3')}</Clause>
            <Clause n="6.4">
              {t('privacyPage.c6_4')}
            </Clause>
            <Clause n="6.5">{t('privacyPage.c6_5')}</Clause>
            <Clause n="6.6">
              {t('privacyPage.c6_6')}
            </Clause>
            <Clause n="6.7">
              {t('privacyPage.c6_7')}
            </Clause>
          </Section>

          <Section title={t('privacyPage.s7Title')}>
            <Clause n="7.1">
              {t('privacyPage.c7_1')}
            </Clause>
            <Clause n="7.2">
              {t('privacyPage.c7_2')}
            </Clause>
          </Section>

          <Section title={t('privacyPage.s8Title')}>
            <Clause n="8.1">
              {t('privacyPage.c8_1')}
            </Clause>
            <Clause n="8.2">
              {t('privacyPage.c8_2')}
            </Clause>
          </Section>

          <Section title={t('privacyPage.s9Title')}>
            <Clause n="9.1">
              {t('privacyPage.c9_1')}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 hover:text-foreground/70">{CONTACT_EMAIL}</a>
            </Clause>
            <Clause n="9.2">
              {t('privacyPage.c9_2')}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 hover:text-foreground/70">{CONTACT_EMAIL}</a>
            </Clause>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
