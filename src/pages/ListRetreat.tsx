import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const benefits = [
  "Reach a global audience of Pilates enthusiasts",
  "Dedicated listing page with photos and details",
  "Direct inquiries from interested guests",
  "No booking fees—keep 100% of your revenue",
  "Support from our team to optimize your listing",
  "Featured placement opportunities",
];

export default function ListRetreat() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6">List Your Retreat</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Connect with passionate Pilates practitioners looking for their next transformative experience.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-section text-foreground mb-8 text-center">Why List with Kinturi?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-sage-light rounded-lg">
                  <div className="w-5 h-5 bg-sage rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-secondary">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-section text-foreground mb-12 text-center">How It Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-lg text-primary-foreground">1</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-2">Get in Touch</h3>
                  <p className="text-body">
                    Contact us with details about your retreat—location, dates, style of Pilates, and what makes your offering unique.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-lg text-primary-foreground">2</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-2">We Review</h3>
                  <p className="text-body">
                    Our team reviews your retreat to ensure it meets our quality standards and aligns with what our community is looking for.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-lg text-primary-foreground">3</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-2">Go Live</h3>
                  <p className="text-body">
                    Once approved, we create your listing and start connecting you with interested guests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-page text-center">
          <h2 className="heading-section text-primary-foreground mb-6">
            Ready to Share Your Retreat?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Contact us to discuss listing your retreat on Kinturi.
          </p>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
