import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy — Kinturi</title>
        <meta name="description" content="How Kinturi collects, uses, and protects your personal data when you use our website." />
        <link rel="canonical" href="https://kinturi.lovable.app/privacy-policy" />
        <meta property="og:title" content="Privacy Policy — Kinturi" />
        <meta property="og:description" content="How Kinturi collects, uses, and protects your personal data when you use our website." />
        <meta property="og:url" content="https://kinturi.lovable.app/privacy-policy" />
      </Helmet>
      <div className="container-page py-16 lg:py-24 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">1. Who We Are</h2>
            <p className="text-sm leading-relaxed">
              Kinturi is a curated platform for fitness-focused holidays and active retreats. This policy explains how we collect, use, and protect your personal data when you use our website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">2. What Data We Collect</h2>
            <p className="text-sm leading-relaxed mb-3">We collect the following data:</p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li><strong>Newsletter subscribers:</strong> Your email address when you sign up to our newsletter.</li>
              <li><strong>Contact form submissions:</strong> Your name, email address, and message content when you contact us.</li>
              <li><strong>Cookie data:</strong> Essential cookies for site functionality and optional analytics cookies (only with your consent).</li>
              <li><strong>Usage data:</strong> Anonymous browsing data such as pages visited and time on site (only with cookie consent).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>To send you our newsletter with retreat updates, offers, and travel inspiration.</li>
              <li>To respond to your enquiries via the contact form.</li>
              <li>To improve our website and understand how visitors use it.</li>
              <li>We will never sell your data to third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">4. Legal Basis for Processing</h2>
            <p className="text-sm leading-relaxed">
              Under GDPR, we process your data based on: <strong>consent</strong> (newsletter sign-up, cookie acceptance) and <strong>legitimate interest</strong> (responding to contact form enquiries, improving our service).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">5. Cookies</h2>
            <p className="text-sm leading-relaxed mb-3">Our website uses the following types of cookies:</p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li><strong>Essential cookies:</strong> Required for the website to function (e.g., cookie consent preference). These cannot be disabled.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site. Only set with your explicit consent.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              You can change your cookie preferences at any time by clearing your browser data and revisiting the site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">6. Data Storage & Security</h2>
            <p className="text-sm leading-relaxed">
              Your data is stored securely using industry-standard encryption and access controls. Newsletter email addresses are stored in a secure database with restricted access. We retain your data only for as long as necessary to fulfil the purposes outlined above.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">7. Your Rights</h2>
            <p className="text-sm leading-relaxed mb-3">Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li><strong>Access</strong> the personal data we hold about you.</li>
              <li><strong>Rectify</strong> any inaccurate data.</li>
              <li><strong>Erase</strong> your data ("right to be forgotten").</li>
              <li><strong>Withdraw consent</strong> at any time (e.g., unsubscribe from the newsletter).</li>
              <li><strong>Object</strong> to processing based on legitimate interest.</li>
              <li><strong>Data portability</strong> — receive your data in a structured format.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:hello@kinturi.com" className="underline text-foreground hover:text-primary transition-colors">hello@kinturi.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">8. Newsletter Unsubscribe</h2>
            <p className="text-sm leading-relaxed">
              You can unsubscribe from our newsletter at any time by visiting our{" "}
              <a href="/unsubscribe" className="underline text-foreground hover:text-primary transition-colors">unsubscribe page</a>{" "}
              or by contacting us directly. We will remove your email address from our mailing list promptly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">9. Third-Party Services</h2>
            <p className="text-sm leading-relaxed">
              We may use third-party services for hosting, analytics, and email delivery. These services process data on our behalf under strict data processing agreements compliant with GDPR.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">10. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed">
              We may update this policy from time to time. Any changes will be posted on this page with an updated "last updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-foreground mb-3">11. Contact Us</h2>
            <p className="text-sm leading-relaxed">
              If you have any questions about this Privacy Policy or your personal data, please contact us at{" "}
              <a href="mailto:hello@kinturi.com" className="underline text-foreground hover:text-primary transition-colors">hello@kinturi.com</a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
