import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-4 text-foreground/80 mb-12 leading-relaxed">
          <p>
            Your privacy is of prime importance to us. We value your Personal Information that you
            share with us. We appreciate the trust you have reposed in us in doing so. Through this
            Privacy Notice we would like to inform you of the manner in which we collect and process
            your Personal Information including and not limited to professional information while
            using our websites, web applications, and/or mobile applications (&ldquo;<strong>Apps</strong>&rdquo;)
            for you to avail the services (&ldquo;<strong>Services</strong>&rdquo;) offered by our
            Company (hereinafter referred to as &ldquo;<strong>{COMPANY}</strong>&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo; or &ldquo;our&rdquo;).
          </p>
          <p>
            The Services, so offered here, adhere to all the laws, rules, regulations and policies
            including Data Protection Laws of India (&ldquo;<strong>Applicable Laws</strong>&rdquo;)
            with regard to the collection, use, disclosure, retention, purging and protection of your
            Personal Information that our Company would have access to as a result of your use of our
            Services and consent thereto.
          </p>
        </div>

        <div className="space-y-10 text-sm md:text-base">
          <Section title="1. Controllers of Personal Information">
            <Clause n="1.1">
              {COMPANY_LEGAL} is the Data Controller of Personal Information collected and processed
              for providing the Services.
            </Clause>
          </Section>

          <Section title="2. What the Company collects from you">
            <SubHeading>Information that you give us</SubHeading>
            <Clause n="2.1.1">
              Any Personally Identifiable Information (&lsquo;Personal Information&rsquo; or
              &lsquo;Personal Data&rsquo;) that we collect from you, with your consent, that relates to
              you, which includes your name, gender, phone number, email address, communication
              address, date of birth, identity proof, banking details to be studied only by the
              concerned professionals, et cetera, in furtherance to the Services being offered by us.
            </Clause>
            <Clause n="2.1.2">
              We may also collect recurring information of your geographic locations on a continuous
              basis in furtherance to the services being provided by us.
            </Clause>

            <SubHeading>Information that we receive automatically</SubHeading>
            <Clause n="2.2.1">
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
            </Clause>
            <Clause n="2.2.2">
              As a standard practise, we use &ldquo;cookies&rdquo; for collecting information, from your
              device through which you are accessing our Services, in order to allow you to enter the
              sessions without frequently having to enter your password. These cookies are temporary
              and are automatically deleted from your device at the end of every session. You are
              always at the discretion to decline the cookies.
            </Clause>

            <SubHeading>Information that is anonymous</SubHeading>
            <Clause n="2.3.1">
              We may also collect such other anonymous information that is not associated with or
              linked to any Personal Information (&ldquo;<strong>Anonymous Data</strong>&rdquo;) and
              which, by itself, does not permit the identification of any individual User. Anonymous
              Data includes without limitation, unique identifiers of the device on which website and /
              or the Apps are installed or accessed, such as VPN, information of Wi-Fi connectivity and
              such other information. We may also store this unique identifier, at many times and create
              a profile for you based on such Anonymous Data.
            </Clause>
          </Section>

          <Section title="3. Purpose for which the information, so collected, is being used">
            <Clause n="3.1">
              We may use the Personal Information and the information so associated with it for the
              following purposes:
            </Clause>
            <Clause n="3.1.1">To effectively provide the Services;</Clause>
            <Clause n="3.1.2">For the purposes of software verification or administering software upgrades;</Clause>
            <Clause n="3.1.3">To maintain the quality of the Services and provide general statistics regarding their use;</Clause>
            <Clause n="3.1.4">
              To deliver Services, including email notifications, confirmations, technical notices,
              updates, security alerts, support and administrative messages that you may request;
            </Clause>
            <Clause n="3.1.5">For archival or backup purposes;</Clause>
            <Clause n="3.1.6">
              To alert you about updated information and other such new or updated services that may be
              offered by other Users;
            </Clause>
            <Clause n="3.1.7">To allow access to exclusive features or functionality of the Apps and / or its website;</Clause>
            <Clause n="3.1.8">
              To launch and/or open other mobile applications installed on your device based on
              functionality of the Apps and / or its website; and
            </Clause>
            <Clause n="3.1.9">To resolve disputes, collect due payments and troubleshoot problems.</Clause>
          </Section>

          <Section title="4. Sharing of the collected information">
            <Clause n="4.1">We may share the Personal Information, so received from you, in the following manner:</Clause>
            <Clause n="4.1.1">With Company&rsquo;s affiliates and Service Providers, as required, to provide the Services;</Clause>
            <Clause n="4.1.2">
              With the Company&rsquo;s affiliates in connection with matters relating to the consumption
              of Services by you to help detect and prevent identity theft, fraud and other potentially
              illegal acts; correlated or multiple accounts to prevent abuse of Services; and to
              facilitate joint or co-branded services that you request, where such services are provided
              by more than one corporate entity other than the Company; and
            </Clause>
            <Clause n="4.1.3">
              If required to do so by law or regulation; to its legal counsel, law enforcement officers,
              governmental authorities who have asserted their lawful authority to obtain the information
              or where the Company has in good faith reasonable grounds to believe that such disclosure
              is reasonably necessary to enforce its Terms of Use or this Privacy Notice.
            </Clause>
            <Clause n="4.2">
              The Company will not rent, sell, or otherwise provide Personal Data received from you to
              third parties without your consent, except as described herein or as required by law.
              However, the Company and its affiliates reserve the right to share, sell and transfer some
              or all of the Personal Data to other business entities should the Company, or its assets,
              plan to merge with, or be acquired by that business entity.
            </Clause>
          </Section>

          <Section title="5. Security of Personal Information">
            <Clause n="5.1">
              The Company has implemented commercially reasonable physical, managerial, operational and
              technical security measures to protect the loss, misuse, alteration and security of the
              Personal Information received from you in the Company&rsquo;s care. The Company&rsquo;s
              security practices and procedures limit access to Personal Data only on &lsquo;need to
              know&rsquo; basis. Such measures may include, where appropriate, the use of firewalls,
              secure server facilities, implementing proper access rights management systems and
              processes, careful selection of processors, standard authentication and encryption
              policies for its servers and other technically and commercially reasonable measures.
            </Clause>
            <Clause n="5.2">
              The Company is committed to protecting the security of any Personal Data and uses
              reasonable efforts including a variety of security technologies and procedures to help
              protect such Personal Data from any unauthorized access, use or disclosure. However, the
              Company can only guarantee such protection of your Personal Information within its
              reasonable control. In situations involving any breach, the Company will try to rectify
              the problems as soon as possible.
            </Clause>
            <Clause n="5.3">
              Any Personal Information, so destroyed, shall be disposed of in a manner that protects the
              privacy of the Personal Information received by us from you in an appropriate manner as per
              the industry standard practices and norms.
            </Clause>
            <Clause n="5.4">
              You hereby acknowledge and understand that all Personal Data provided by you is with your
              express consent and understand the risk involved sharing your Personal Information.
            </Clause>
          </Section>

          <Section title="6. Your Obligation">
            <Clause n="6.1">
              As a registered user of the Services, you have certain obligations to other users. Some of
              these obligations are imposed by Applicable Laws and regulations:
            </Clause>
            <Clause n="6.2">
              You must, at all times, abide by the terms and conditions of the Privacy Notice and Terms
              of Use.
            </Clause>
            <Clause n="6.3">You must respect all intellectual property rights that may belong to third parties.</Clause>
            <Clause n="6.4">
              You must not upload or insert any comments that may be deemed to be injurious, violent,
              offensive, sexist, casteist, racist or xenophobic, or which may otherwise violate the
              purpose and spirit of our Company and its community of users;
            </Clause>
            <Clause n="6.5">You must keep your username and passwords confidential and not share it with others; and</Clause>
            <Clause n="6.6">
              All information given must be genuine and true. The Company shall not be held responsible
              in case of any wrong or fraudulent information given at the time of registration or at any
              subsequent time for using our Services.
            </Clause>
            <Clause n="6.7">
              Any violation of this Privacy Notice by you may lead to the restriction, suspension or
              termination of your account with us, at the sole discretion of the Company.
            </Clause>
          </Section>

          <Section title="7. Governing Law">
            <Clause n="7.1">
              The usage of the Services is exclusively governed by the Laws applicable in India and the
              jurisdiction of the competent courts at Kakinada, State of Andhra Pradesh.
            </Clause>
            <Clause n="7.2">
              The Company expressly disclaims any implied warranties or liabilities imputed by the laws
              of any other jurisdiction.
            </Clause>
          </Section>

          <Section title="8. Modifications">
            <Clause n="8.1">
              Any modification to this Privacy Notice by the Company would be in accordance with the
              Applicable Laws and posted on the Website to reflect such modification so that you are
              always aware of what information Company collects and how it processes your Personal
              Information.
            </Clause>
            <Clause n="8.2">
              You are requested to periodically visit this page for the latest information on
              Company&rsquo;s privacy practices. Once posted, those changes are effective immediately.
              Continued access or use of the Apps and / or its website constitutes your acceptance of
              the changes and the amended Policy.
            </Clause>
          </Section>

          <Section title="9. Questions/Grievances">
            <Clause n="9.1">
              In the event of query or clarification regarding this Privacy Notice you may write to the
              email address:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 hover:text-foreground/70">{CONTACT_EMAIL}</a>
            </Clause>
            <Clause n="9.2">
              In the event, you have grievances with respect to your Personal Information, you may write
              to the email address:{" "}
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
