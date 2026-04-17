import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import aboutMovementImg from "@/assets/about-movement.jpg";

export default function About() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6 max-w-4xl mx-auto">
            About Kinturi
          </h1>
          <p className="font-serif italic text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            We find the world's best active retreats. You just have to show up.
          </p>
        </div>
      </section>

      {/* Section 1 — The Why */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-section text-foreground mb-8">The Why</h2>
            <div className="space-y-6 text-body text-lg">
              <p>Kinturi was born out of a simple frustration.</p>
              <p>
                After years working in the travel industry, it became clear that active travellers were being underserved. The retreats that took fitness seriously rarely took the overall experience seriously. The beautiful ones too often defaulted to candles, crystals, and a schedule built around silence. And the gap between the two – genuinely exceptional movement experiences in places worth travelling to – was almost impossible to find in one place.
              </p>
              <p>So we built it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric image */}
      <section className="bg-background">
        <div className="w-full">
          <img
            src={aboutMovementImg}
            alt="Group of hikers with backpacks walking a forest trail toward a rocky peak"
            width={1600}
            height={1000}
            loading="lazy"
            className="w-full h-[50vh] md:h-[60vh] object-cover"
          />
        </div>
      </section>

      {/* Section 2 — Who We Serve */}
      <section className="section-padding bg-secondary">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-section text-foreground mb-8">Who We Serve</h2>
            <div className="space-y-6 text-body text-lg">
              <p>
                Kinturi is for travellers who consider staying active part of the holiday, not a compromise on it.
              </p>
              <p>
                People who pack their trainers without thinking twice. Who find as much pleasure in a well-programmed morning session as in a long lunch with local wine afterwards. Who travel solo, with a partner, or with a group of friends – and want to come home feeling better than when they left.
              </p>
              <p>
                No rigid ideology. No forced spirituality. Just movement, good food, beautiful places, and the kind of rest you actually have to earn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Value Proposition */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-section text-foreground mb-8">Built on Quality</h2>
            <div className="space-y-6 text-body text-lg">
              <p>
                Every retreat in the Kinturi collection is personally researched and vetted against one brief: it has to be genuinely exceptional.
              </p>
              <p>
                Not just the fitness programming – the setting, the food, the accommodation, the overall experience. We only list what we'd book ourselves, which means nothing makes it onto this site because it paid to be here or ticked a box on a spreadsheet.
              </p>
              <p>
                The result is a collection built entirely on quality. Curated by someone with years of experience in the travel industry who knows the difference between a retreat that looks good on a website and one that delivers in person.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — CTA */}
      <section className="section-padding bg-secondary">
        <div className="container-page text-center">
          <h2 className="heading-section text-foreground mb-6">
            Ready to move?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Browse our collection of hand-picked active retreats, or sign up to The Kinturi Edit – our newsletter for new retreats, insider guides, and escapes worth the trip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="default" size="lg" asChild>
              <Link to="/retreats">Browse Retreats</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#newsletter">Sign Up to The Kinturi Edit</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter">
        <NewsletterSignup />
      </section>
    </Layout>
  );
}
