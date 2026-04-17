import { Layout } from "@/components/layout/Layout";
import founderImg from "@/assets/founder-portrait.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6">About Kinturi</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-section text-foreground mb-8">Why Kinturi?</h2>
            <div className="space-y-6 text-body text-lg">
              <p>
                Kinturi is designed for the kind of holiday-goer that gets bored sitting on a beach for more than 30 minutes. You work hard all year, often sitting behind a desk for hundreds of hours, so when it's time to take a holiday you want to also catch up on your fitness and wellness too. Combining beautiful destinations, quality fitness instruction and world-class cuisine, we're all about enjoying the good things in life (and feeling like you've earnt it!)
              </p>
              <p>
                Every retreat in our collection is hand-picked. We visit, we vet, and we only 
                list what we'd book ourselves.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-section text-foreground mb-12 text-center">What We Value</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">Authenticity</h3>
                <p className="text-small">
                  We partner with passionate instructors who bring genuine expertise and care to their teaching.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">Quality</h3>
                <p className="text-small">
                  Every retreat meets our standards for instruction, accommodation, and overall experience.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">Connection</h3>
                <p className="text-small">
                  We believe in the power of community and the bonds formed through shared practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-page text-center">
          <h2 className="heading-section text-primary-foreground mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Explore our collection of retreats and find the experience that speaks to you.
          </p>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/retreats">View Retreats</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
