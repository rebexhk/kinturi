import { Layout } from "@/components/layout/Layout";
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
            <h2 className="heading-section text-foreground mb-8">Our Story</h2>
            <div className="space-y-6 text-body text-lg">
              <p>
                Kinturi exists for the people who come back from holiday feeling better than when they left. 
                We believe movement is the best way to recharge - and that it doesn't have to mean 
                punishing yourself. It means finding your rhythm somewhere beautiful, pushing 
                yourself in good company, and earning every moment of rest.
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
