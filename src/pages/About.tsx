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
            Connecting practitioners with transformative Pilates experiences worldwide.
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
                Kinturi was born from a simple belief: that the combination of mindful movement, 
                beautiful surroundings, and expert guidance can create truly transformative experiences.
              </p>
              <p>
                We founded Kinturi to make it easier for Pilates enthusiasts to discover retreats that 
                go beyond the ordinary—experiences that nourish the body, calm the mind, and inspire 
                lasting wellness habits.
              </p>
              <p>
                Every retreat on our platform is carefully vetted to ensure quality instruction, 
                thoughtful programming, and accommodation that enhances the overall experience. 
                Whether you're a seasoned practitioner or new to Pilates, we're here to help you 
                find your perfect retreat.
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
