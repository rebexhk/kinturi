import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import aboutMovementImg from "@/assets/about-movement.jpg";
import aboutVillaImg from "@/assets/about-villa.jpg";
import aboutCheersImg from "@/assets/about-cheers.jpg";
import aboutYogaImg from "@/assets/about-yoga.jpg";

export default function About() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6 max-w-4xl mx-auto">
            About Kinturi
          </h1>
          <p className="text-body text-lg text-muted-foreground max-w-3xl mx-auto">
            We find the world's best active retreats. You just have to show up.
          </p>
        </div>
      </section>

      <section className="pt-16 md:pt-20 pb-8 md:pb-10 bg-background">
        <div className="container-page text-center max-w-3xl mx-auto">
          <h2 className="heading-section text-foreground mb-6 animate-fade-in-up">
            Recharge Through Movement
          </h2>
          <p className="text-body text-lg leading-relaxed">
            Kinturi is for anyone who considers staying active part of the holiday, not a compromise on it. Who find just as much pleasure in a morning hike or well-programmed fitness class as relaxing by the pool or in a long dinner with local wine.
          </p>
          <p className="text-body text-lg leading-relaxed mt-6">
            Our collection spans the world's best active retreats, adventurous escapes, and fitness-focused holidays: handpicked for the quality of their movement, their settings, and everything that happens after the workout. Great food, quality coaching, beautiful places. Equally suited to solo travellers, couples, and groups of friends who want a holiday that leaves you more energised than when you started.
          </p>
        </div>
      </section>

      {/* Section 1 — The Why (text + portrait image) */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 text-body text-lg">
              <h2 className="heading-section text-foreground mb-4">The Why</h2>
              <p>Kinturi was born out of a simple frustration.</p>
              <p>
                After hours spent searching for the kind of holidays we like (active escapes that don't skimp on quality and setting), it became clear that active travellers were being underserved. The retreats that took fitness seriously rarely took the overall experience seriously. The beautiful ones too often defaulted to candles, crystals, and a schedule built around too much silence and calm for our liking. And the gap between the two (genuinely exceptional movement experiences in places worth travelling to) was almost impossible to find in one place.
              </p>
              <p>So we built it.</p>
            </div>
            <div className="order-first md:order-last">
              <img
                src={aboutMovementImg}
                alt="Group of hikers with backpacks walking a forest trail toward a rocky peak"
                width={800}
                height={1000}
                loading="lazy"
                className="w-full h-[400px] md:h-[560px] object-cover rounded-sm shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic full-width break — Tuscan villa */}
      <section className="bg-background">
        <div className="w-full">
          <img
            src={aboutVillaImg}
            alt="Aerial view of a stone villa with pool nestled in the rolling hills of the Tuscan countryside"
            width={1600}
            height={900}
            loading="lazy"
            className="w-full h-[45vh] md:h-[65vh] object-cover"
          />
        </div>
      </section>

      {/* Section 2 — Who We Serve (image left + text right) */}
      <section className="section-padding bg-secondary">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <img
                src={aboutYogaImg}
                alt="Group practising downward dog yoga poses on mats on an outdoor wooden deck, framed by green foliage"
                width={800}
                height={1000}
                loading="lazy"
                className="w-full h-[400px] md:h-[560px] object-cover rounded-sm shadow-lg"
              />
            </div>
            <div className="space-y-6 text-body text-lg">
              <h2 className="heading-section text-foreground mb-4">Who We Serve</h2>
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

      {/* Section 3 — Built on Quality (text left + image right) */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 text-body text-lg">
              <h2 className="heading-section text-foreground mb-4">Built on Quality</h2>
              <p>
                Every retreat in the Kinturi collection is personally researched and vetted, and it must pass our exceptional standards.
              </p>
              <p>
                Not just the fitness programming, but also the setting, the food, the accommodation, the overall experience. We only list what we'd book ourselves, which means nothing makes it onto this site because it paid to be here or ticked a box on a spreadsheet.
              </p>
              <p>
                The result is a collection built entirely on quality. Curated by a team with over a decade of experience in the travel industry who know the difference between a retreat that looks good on a website and one that delivers in person.
              </p>
            </div>
            <div className="order-first md:order-last">
              <img
                src={aboutCheersImg}
                alt="Friends clinking glasses of white wine in the sunshine after a day of activity"
                width={800}
                height={1000}
                loading="lazy"
                className="w-full h-[400px] md:h-[560px] object-cover rounded-sm shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>


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
