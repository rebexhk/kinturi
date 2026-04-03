import { Layout } from "@/components/layout/Layout";

export default function TermsConditions() {
  return (
    <Layout>
      <div className="container-page py-16 lg:py-24 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">1. About Kinturi</h2>
            <p className="text-sm leading-relaxed">
              Kinturi is a curated platform that showcases fitness-focused holidays and active retreats. We act as a discovery platform — bookings and payments are handled directly between you and the retreat host/operator.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">2. Use of Our Website</h2>
            <p className="text-sm leading-relaxed">By using our website, you agree to:</p>
            <ul className="list-disc pl-5 text-sm space-y-2 mt-3">
              <li>Use the site for lawful purposes only.</li>
              <li>Not attempt to gain unauthorised access to any part of the site.</li>
              <li>Not use automated tools to scrape or copy content without permission.</li>
              <li>Provide accurate information when submitting forms or signing up to our newsletter.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">3. Retreat Listings</h2>
            <p className="text-sm leading-relaxed">
              While we take care to ensure the accuracy of retreat information on our platform, listings are provided by retreat hosts. Kinturi does not guarantee the accuracy, completeness, or availability of any retreat listing. Prices, dates, and availability are subject to change by the host at any time.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">4. Bookings & Payments</h2>
            <p className="text-sm leading-relaxed">
              Kinturi is not a booking platform. Any bookings, payments, cancellations, or refunds are handled directly between you and the retreat host/operator. We are not liable for any disputes arising from bookings made through external hosts.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">5. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">
              All content on this website — including text, images, logos, and design — is the property of Kinturi or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or use any content without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">6. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              Kinturi provides this website on an "as is" basis. To the fullest extent permitted by law, we exclude all liability for any loss or damage arising from your use of the website, including but not limited to indirect or consequential losses.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">7. External Links</h2>
            <p className="text-sm leading-relaxed">
              Our website may contain links to external sites. We are not responsible for the content or privacy practices of these third-party sites.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">8. Newsletter</h2>
            <p className="text-sm leading-relaxed">
              By subscribing to our newsletter, you consent to receiving marketing emails from Kinturi. You can unsubscribe at any time via our{" "}
              <a href="/unsubscribe" className="underline text-foreground hover:text-primary transition-colors">unsubscribe page</a>{" "}
              or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">9. Changes to These Terms</h2>
            <p className="text-sm leading-relaxed">
              We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">10. Governing Law</h2>
            <p className="text-sm leading-relaxed">
              These terms are governed by and construed in accordance with the laws of Scotland. Any disputes will be subject to the exclusive jurisdiction of the Scottish courts.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">11. Contact Us</h2>
            <p className="text-sm leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at{" "}
              <a href="mailto:hello@kinturi.com" className="underline text-foreground hover:text-primary transition-colors">hello@kinturi.com</a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
