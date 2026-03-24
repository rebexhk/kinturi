import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-cover.jpg";

interface FeaturedRetreat {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  type: string;
  hero_image_url: string | null;
}

export default function Index() {
  const [featuredRetreats, setFeaturedRetreats] = useState<FeaturedRetreat[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("retreats")
        .select("id, title, slug, location, duration, type, hero_image_url")
        .eq("status", "published")
        .eq("featured", true)
        .limit(6);
      if (data) setFeaturedRetreats(data);
    };
    fetchFeatured();
  }, []);

  return (
    <Layout transparentHeader>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Pilates reformer retreat with mountain views" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="heading-display text-primary-foreground mb-6">
            Find Your Perfect Active Retreat
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto font-light md:text-2xl">Discover a curated selection of fitness-focused holidays and active escapes worldwide.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/retreats">
                Explore Retreats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/contact">Request to Book</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-delay-2">
          <ChevronDown className="h-6 w-6 text-primary-foreground/60 animate-bounce" />
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding bg-background">
        <div className="container-page text-center max-w-3xl mx-auto">
          <h2 className="heading-section text-foreground mb-6 animate-fade-in-up">
            Wellness Through Movement
          </h2>
          <p className="text-body text-lg leading-relaxed">Kinturi connects you with carefully curated active escapes that combine expert instruction, stunning locations, and mindful experiences. Whether you're tackling your next challenge, or using movement to relax and connect with new people, we have a trip for you.</p>
        </div>
      </section>

      {/* Featured Retreats */}
      {featuredRetreats.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-page">
            <div className="text-center mb-12">
              <h2 className="heading-section text-foreground mb-4">Featured Retreats</h2>
              <p className="text-body">Handpicked experiences for your journey</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRetreats.map(retreat => (
                <Link key={retreat.id} to={`/retreats/${retreat.slug}`} className="group block bg-background rounded-lg overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={retreat.hero_image_url || heroImage}
                      alt={retreat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs tracking-wide uppercase text-primary font-medium">
                      {retreat.type}
                    </span>
                    <h3 className="heading-card text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                      {retreat.title}
                    </h3>
                    <p className="text-small">
                      {retreat.location} · {retreat.duration}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="sage-outline" size="lg" asChild>
                <Link to="/retreats">
                  View All Retreats
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-primary">
        <div className="container-page text-center">
          <h2 className="heading-section text-primary-foreground mb-6">Work with us</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">Are you a retreat organiser or venue manager? List your retreat on Kinturi and connect with guests worldwide.</p>
          <Button variant="hero-outline" size="lg" asChild>
            <Link to="/list-retreat">Learn More</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
