import { Link } from "react-router-dom";
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {LAST_UPDATED}</p>

        <p className="text-foreground/80 mb-12 leading-relaxed">
          <strong>{COMPANY_LEGAL} (&ldquo;Company&rdquo;)</strong> is a company incorporated under the
          provisions of Companies Act 2013. The Company is in the business of providing products and
          services with respect to trading, importing, exporting, and growing in marine based or sea
          foods, farm foods, fisheries and to undertaking cold storage business, food processing
          business, animal husbandry, poultry business, to carry on the business of producers,
          purchasing, selling, import, export and generally deal in all kinds of marine based or sea
          food items and its bye-products thereof and to act as consultants, e-commerce, importers,
          exporters, whole-sellers, retailers, indenters, agents, representatives, distributors and,
          also to create an online store, purchase, franchise business model or sell using electronic
          commerce solutions (&ldquo;<strong>Services</strong>&rdquo;).
        </p>

        <div className="space-y-10 text-sm md:text-base">
          <Section title="1. Applicability of the Terms">
            <Clause n="1.1">
              The <strong>Terms of Use (&ldquo;Terms&rdquo;)</strong> herein sets out the terms and
              conditions for availing the Services offered by the Company by using the website and
              applications accessible at apple app store, google play store and url&rsquo;s that may be
              published on {WEBSITE} or by mile deep works from time to time. (<strong>&quot;Website&quot;</strong>).
            </Clause>
            <Clause n="1.2">
              You hereby agree and acknowledge that by accessing or using the Services offered by the
              Company, you hereby expressly confirm that you have read, understood and agree to comply
              with and be bound by the Terms.
            </Clause>
            <Clause n="1.3">
              In the event you do not agree to any or all of the Terms, you are requested to not access
              and use any of the Services offered by the Company or the Website.
            </Clause>
            <Clause n="1.4">
              You understand that the Company may amend the Terms related to the Services from time to
              time as it may deem fit and necessary. Any amendment to the Terms shall be effective upon
              Company&rsquo;s posting of such updated Terms on the Website and there shall not be any
              specific notice for the same, and you agree to be updated with the latest amendments,
              alteration or modifications, so made by the Company in the Terms.
            </Clause>
          </Section>

          <Section title="2. Registration">
            <Clause n="2.1">
              Wherever applicable, you agree to sign up and create an authenticated account
              (&ldquo;Account&rdquo;) by providing all required information in order to access or use the
              Services (&ldquo;Sign-up Process&rdquo;). You shall identify a username and password and
              provide the requisite information for creating your Account on the Website.
            </Clause>
            <Clause n="2.2">You agree and acknowledge that you shall:</Clause>
            <Clause n="2.2.1">Create only 1 (one) Account using your credentials unless approved expressly in writing by the Company;</Clause>
            <Clause n="2.2.2">Provide accurate, truthful, current and complete information when creating your Account and in all your dealings through the Company;</Clause>
            <Clause n="2.2.3">Maintain and promptly update your Account information, if required;</Clause>
            <Clause n="2.2.4">Maintain the security of your Account by not sharing your password with others and restricting access to your Account; and</Clause>
            <Clause n="2.2.5">Promptly notify the Company if you discover or otherwise suspect any security breaches relating to the Website.</Clause>
            <Clause n="2.3">
              You agree and acknowledge that any and all activity undertaken by you from the Account
              shall be your sole responsibility and the Company shall not be responsible or liable for
              the same in any manner towards you or any other third-party.
            </Clause>
            <Clause n="2.4">
              In the event, the Company finds the information, so provided by you, to be untrue,
              inaccurate, outdated, or incomplete, then it shall be entitled to terminate your Account
              and refuse current or future use of any and/or all of the Services and you shall be liable
              to indemnify and hold harmless the Company and/or its affiliates, directors, employees, and
              agents to the extent of the loss incurred.
            </Clause>
            <Clause n="2.5">
              The Company will not be liable for any loss or damage arising from the failure on your
              part to comply with the provision of these Terms. Further, you agree to indemnify and hold
              the Company and/or its affiliates, directors, employees, and agents harmless from any
              claims or damages suffered by the Company and/or its affiliates, directors, employees, and
              agents due to any use of the Account.
            </Clause>
          </Section>

          <Section title="3. Eligibility to use the Services">
            <Clause n="3.1">You will be eligible to use the Services only by registering with the Company and fulfilling following qualifications:</Clause>
            <Clause n="3.1.1">You have the required right, authority, license and/or permission; and</Clause>
            <Clause n="3.1.2">
              You are not engaged in any business which directly or indirectly (including through
              companies owned or controlled by you) competes with our business or activities of the
              Company being conducted.
            </Clause>
          </Section>

          <Section title="4. Pricing and Payment for Services">
            <Clause n="4.1">
              Any payments due to the Company for the Services may be paid online via credit card, debit
              card, net banking, UPI payment, and/or through multiple online payment wallets such as
              Google Pay, Paytm, etcetera.
            </Clause>
            <Clause n="4.2">You acknowledge that your payments shall also be governed by the terms and conditions of the respective payment methods/payment gateways.</Clause>
            <Clause n="4.3">
              You understand and agree that the details (whether of debit card, credit card, net banking,
              UPI payment or payment through online wallets) provided by you to make payments and transact
              on Website shall be correct, accurate and shall be owned by you.
            </Clause>
            <Clause n="4.4">
              In the event you use payment details belonging to any third party, then, you confirm that
              you have been authorized to or expressly permitted by such third party to use the said
              details/payment mode for making payments.
            </Clause>
            <Clause n="4.5">
              The Company will not be liable for any payment fraud including any credit card/debit card
              fraud. The liability for use of a payment mode fraudulently will be on you and the onus to
              &lsquo;prove otherwise&rsquo; shall be exclusively on you.
            </Clause>
            <Clause n="4.6">
              In addition to all other remedies available under law and equity and as detailed herein,
              the Company reserves the right to recover the cost of servicing, collection charges,
              attorney&rsquo;s charges, etcetera from you in case of the Company suffering any loss or
              claim. Further, the Company reserves the right to initiate legal proceedings against such
              persons for fraudulent use of the Website and any other unlawful acts or omissions in
              breach of the Terms.
            </Clause>
          </Section>

          <Section title="5. Privacy Policy">
            <Clause n="5.1">The Company respects your privacy and has accordingly formulated a privacy policy, in compliance with the applicable laws (the <strong>&ldquo;Privacy Policy&rdquo;</strong>).</Clause>
            <Clause n="5.2">The use of any personal information shall be governed by the Privacy Policy as provided on this Website and amended from time to time.</Clause>
            <Clause n="5.3">
              Kindly <Link to="/privacy" className="underline underline-offset-4 hover:text-foreground/70">click here</Link> to access the Privacy Policy of the Company.
            </Clause>
          </Section>

          <Section title="6. Third Party Links">
            <Clause n="6.1">
              The Company may include links to other websites or applications that are not owned or
              operated by the Company. The Company does not have any control over these third-party
              websites or applications (the <strong>&ldquo;Third-Party Links&rdquo;</strong>) and is not
              responsible for any information, functionality, or content accessed through the Third-Party Links.
            </Clause>
            <Clause n="6.2">The Third-Party Links do not represent or imply any endorsement or recommendation of such third party&rsquo;s websites or applications by or on behalf of the Company.</Clause>
            <Clause n="6.3">You are responsible for taking the necessary precautions to protect yourself and your mobile devices, computer and other devices from viruses, bugs, and other harmful or destructive content that may be accessible through such Third-Party Links.</Clause>
            <Clause n="6.4">The Company disclaims any responsibility for any harm resulting from your access or use of these Third-Party Links.</Clause>
          </Section>

          <Section title="7. Restrictions on Use">
            <Clause n="7.1">You shall not use the Services provided by the Website for any unlawful purpose or in violation of any applicable laws.</Clause>
            <Clause n="7.2">You shall not infringe the copyright, trademark, trade secret or other intellectual property rights of the Company or any third party or violate the privacy or other personal rights of the Company or any third party.</Clause>
            <Clause n="7.3">You shall not post any content that is defamatory, libelous, obscene, threatening, abusive or is offensive to the Company or any other person, such as content or messages that promotes racism, bigotry, hatred or physical harm of any kind against any group or individual.</Clause>
            <Clause n="7.4">You shall not post any content that is false or misleading; or that harasses or advocates harassment of another person.</Clause>
            <Clause n="7.5">You are also prohibited from violating the security of the Website and disassemble, de-compile or otherwise reverse engineer the software of the Website or otherwise attempt to learn the source code, structure, algorithms or ideas underlying the software of the Website.</Clause>
            <Clause n="7.6">In case of any violations of system or network security, the Company shall be entitled to take actions in accordance with the applicable laws including filing any civil or criminal suit in the appropriate court.</Clause>
          </Section>

          <Section title="8. Remedies">
            <Clause n="8.1">In the event, you are found to have violated any of the Terms, the Company reserves the right to do any or all of the following:</Clause>
            <Clause n="8.1.1">Take any action remediating the violation by removing the offending communication or content from Website,</Clause>
            <Clause n="8.1.2">Terminating your registration and / or blocking you from using the Services and the Website,</Clause>
            <Clause n="8.1.3">If required, take support from law enforcement authorities to take necessary legal action, including filing a case or complaint; or</Clause>
            <Clause n="8.1.4">Seek compensation to the extent of loss caused to the Company.</Clause>
            <Clause n="8.2">You acknowledge that in no event shall the Company be liable for any damages whatsoever whether direct, indirect, general, special, compensatory, consequential, punitive or incidental, arising out of or relating to the conduct of you or anyone else in connection with the use of the Services.</Clause>
          </Section>

          <Section title="9. Security">
            <Clause n="9.1">The Company acknowledges that it employs industry standard security protocol and/or reasonable security standards as per the laws governing information technology and/or data protection and privacy to ensure that the information that are stored, transmitted or transferred through the Website is protected and the same is hosted on a secure server.</Clause>
            <Clause n="9.2">The Company shall not be held responsible for the loss of your information that takes place despite following standard security protocol and/or reasonable security standards.</Clause>
            <Clause n="9.3">In order to keep your Account safe, you agree to maintain the confidentiality of the username and password, and to change the password of the Account periodically.</Clause>
            <Clause n="9.4">You will be solely responsible for maintaining the confidentiality of the username and password, and for all activities that occur from the Account.</Clause>
          </Section>

          <Section title="10. Intellectual Property">
            <Clause n="10.1">The Company, its technology, computer programs, codes, all information available thereon, images, logos, trade names, domain names, service marks and other materials on it, including the look and feel of the Website, are the exclusive intellectual property of the Company and/or its affiliates. Any unauthorized reproduction, republication, distribution, display, transmission, sale, or any other use and/or duplication of any material available on Website, without express and written approval of the Company shall be violation of the relevant intellectual property laws.</Clause>
          </Section>

          <Section title="11. Termination">
            <Clause n="11.1">The Terms shall remain in full force and effect unless and until the Account is terminated as provided herein.</Clause>
            <Clause n="11.2">You may deactivate the Account and end the registration with the Company at any time, for any reason by using the features in the Website provided that such termination shall not absolve you of any liability towards the Company arising from the Services or your use of the Website.</Clause>
            <Clause n="11.3">The Company may also suspend or terminate your use of the Website, and/or the Account, at any time, for any breach of these Terms.</Clause>
            <Clause n="11.4">Subject to applicable law, the Company reserves the right to maintain, delete or destroy all communications or materials posted or uploaded on to this Website pursuant to its internal record retention and/or content destruction policies. After such termination, the Company will have no further obligation to provide the Services to you.</Clause>
            <Clause n="11.5">The Company further reserves the right to terminate these Terms or discontinue the Services provided through this Website or any portion or feature thereof for any or no reason and at any time without any liability towards you or any other third-party.</Clause>
            <Clause n="11.6">The Company will not be liable to you for any costs, expenses, or damages as a result of the termination of these Terms.</Clause>
          </Section>

          <Section title="12. Disclaimer & Warranties">
            <Clause n="12.1">The content and all the Services associated with the Website are provided to you on an &ldquo;as-is&rdquo; and &ldquo;as available&rdquo; basis. The Company makes no representations or warranties of any kind, express or implied, as to the content or operation of the Website or of the Service. You expressly agree and acknowledge that your use of the Service is at your sole risk.</Clause>
            <Clause n="12.2">The Company makes no representations, warranties or guarantees, express or implied, regarding (a) the accuracy, reliability or completeness of the content on the Website, or (b) of the Service and products and expressly disclaims any warranties of non-infringement or fitness for a particular purpose.</Clause>
            <Clause n="12.3">The Company engages and employs the best methods to safeguard and protect against viruses, infection, et cetra, however, despite such best efforts, the Company makes no representation, warranty or guarantee that the content that may be available through the Service is free of infection from any viruses or other code or computer programming routines that contain contaminating or destructive properties or that are intended to damage, surreptitiously intercept or expropriate any system, data or personal information.</Clause>
            <Clause n="12.4">The Company expressly disclaims any emergency services.</Clause>
          </Section>

          <Section title="13. Limitation of Liability">
            <Clause n="13.1">Neither the Company nor any of its affiliates shall be liable for any indirect, incidental, special, or consequential damages resulting from the use or the inability to use the Website and/or damages for lost profits, loss of data.</Clause>
          </Section>

          <Section title="14. Indemnification">
            <Clause n="14.1">You shall indemnify and hold harmless the Company and/or its affiliates, directors, employees, and agents against any loss or damage suffered on account of fraud, willful neglect and loss of data done and/or caused by you and against all damages, losses, and expenses of any kind, including reasonable legal fees and costs, related to such claim brought against the Company by any third party.</Clause>
          </Section>

          <Section title="15. Governing Law and Jurisdiction">
            <Clause n="15.1">These Terms shall be governed by, interpreted and construed in accordance with the laws of India.</Clause>
            <Clause n="15.2">In case of any dispute, claim or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation or validity thereof or the use of the Website (collectively, <strong>&ldquo;Disputes&rdquo;</strong>), the Company and you shall attempt to settle the same amicably, through negotiation and consultation at such offices of the Company as the Company may designate.</Clause>
            <Clause n="15.3">In the event the dispute remains unresolved for 15 (fifteen) days, either party may refer such dispute to arbitration according to the provisions of the Arbitration and Conciliation Act of 1996 amended from time to time, to a sole arbitrator appointed mutually by the parties.</Clause>
            <Clause n="15.4">The language of the arbitration shall be English and the arbitral award shall be binding on both the parties.</Clause>
            <Clause n="15.5">The seat and venue of the arbitration shall be Kakinada, Andhra Pradesh unless otherwise mutually agreed by the Company and you in writing.</Clause>
          </Section>

          <Section title="16. Non-repudiation">
            <Clause n="16.1">Any and all actions undertaken by you and/or your affiliates, directors, employees, agents, and/or personnel on the Website shall be deemed as actions approved by you including and not limited to transfer/change of passwords and the Company shall not have any liability towards such actions.</Clause>
          </Section>

          <Section title="17. Miscellaneous">
            <Clause n="17.1">These Terms shall be interpreted, construed and enforced in accordance with the laws as applicable in India without regard to conflict/choice of law principles. In a situation where any provision of this Agreement is found to be invalid or unenforceable, such provision shall be severed from the remaining Agreement, which shall remain in full force and effect.</Clause>
            <Clause n="17.2">No waiver of any breach or default of the Agreement shall be deemed to be a waiver of any preceding or subsequent breach or default. The section headings used in this Agreement should not be used for any interpretative purposes as these are for your convenience only.</Clause>
            <Clause n="17.3">All of the Company&rsquo;s rights and obligations under these Terms are freely assignable by the Company in connection with a merger, acquisition, or sale of assets, or by operation of law or otherwise.</Clause>
            <Clause n="17.4">The Company reserves the right to research and publish general user behavior categorized at its discretion.</Clause>
            <Clause n="17.5">By using the Website, you agree to receive account and feature e-mails, calls and messages from the Company.</Clause>
            <Clause n="17.6">The Website uses temporary cookies to store certain data (that is not sensitive personal data or information) that is used by the Company for the technical administration of the Website, research and development, and for user administration. In the course of serving advertisements or optimizing the Services to you, the Website may allow authorized third parties to place or recognize a unique cookie on your web browser. The Company does not store personally identifiable information in the cookies.</Clause>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
