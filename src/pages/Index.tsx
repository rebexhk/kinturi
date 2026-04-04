import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ReviewSummary } from "@/components/ReviewSummary";
import heroImage from "@/assets/hero-cover.jpg";

interface FeaturedRetreat {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  type: string[];
  hero_image_url: string | null;
}

export default function Index() {
  const [featuredRetreats, setFeaturedRetreats] = useState<FeaturedRetreat[]>([]);
  const [reviewStats, setReviewStats] = useState<Record<string, { avg: number; count: number }>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [retreatsRes, reviewsRes] = await Promise.all([
        supabase
          .from("retreats")
          .select("id, title, slug, location, duration, type, hero_image_url")
          .eq("status", "published")
          .eq("featured", true)
          .limit(6),
        supabase.from("reviews").select("retreat_id, rating"),
      ]);
      if (retreatsRes.data) setFeaturedRetreats(retreatsRes.data);
      if (reviewsRes.data) {
        const stats: Record<string, { avg: number; count: number }> = {};
        reviewsRes.data.forEach((r: any) => {
          if (!stats[r.retreat_id]) stats[r.retreat_id] = { avg: 0, count: 0 };
          stats[r.retreat_id].count++;
          stats[r.retreat_id].avg += r.rating;
        });
        Object.keys(stats).forEach((id) => {
          stats[id].avg = stats[id].avg / stats[id].count;
        });
        setReviewStats(stats);
      }
    };
    fetchData();
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
      <section className="pt-16 md:pt-24 pb-8 md:pb-10 bg-background">
        <div className="container-page text-center max-w-3xl mx-auto">
          <h2 className="heading-section text-foreground mb-6 animate-fade-in-up">
            Wellness Through Movement
          </h2>
          <p className="text-body text-lg leading-relaxed">You work hard, and we believe your time off should work just as hard for you. Kinturi helps you discover Active Retreats designed for those looking to find their "zen" in a high-intensity reformer session rather than a silent meditation. We combine fitness-focused holidays with the actual holiday part. Think challenging morning workouts followed by an afternoon poolside with a book, a coastal walk at your own pace, or tasting local wines with new friends. Whether you're traveling solo or looking to find your tribe, we provide the perfect balance of community and "me-time." No forced spirituality - just transformative movement in the world's most beautiful destinations.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="pt-8 md:pt-10 pb-12 md:pb-16 bg-background">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="heading-section text-foreground mb-4 animate-fade-in-up">
              How It Works
            </h2>
            <p className="text-body text-lg max-w-2xl mx-auto">
              Finding your perfect active retreat is simple
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-16 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Browse & Discover",
                description:
                  "Explore our curated collection of fitness-focused retreats across the world's most beautiful destinations.",
              },
              {
                step: "02",
                title: "Choose Your Experience",
                description:
                  "Filter by activity type, location and duration to find the retreat that fits your goals and schedule.",
              },
              {
                step: "03",
                title: "Book & Go",
                description:
                  "Get in touch to reserve your spot. We'll handle the details so you can focus on showing up and switching off.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="font-serif text-5xl font-light text-primary/30 block mb-4">
                  {item.step}
                </span>
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Retreats */}
      {featuredRetreats.length > 0 && (
        <section className="pt-12 md:pt-16 pb-16 md:pb-24 bg-secondary">
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
                      {(retreat.type || []).join(" · ")}
                    </span>
                    <h3 className="heading-card text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                      {retreat.title}
                    </h3>
                    <p className="text-small mb-1">
                      {retreat.location} · {retreat.duration}
                    </p>
                    {reviewStats[retreat.id] && (
                      <ReviewSummary avgRating={reviewStats[retreat.id].avg} count={reviewStats[retreat.id].count} />
                    )}
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

      {/* Newsletter Signup */}
      <NewsletterSignup />

    </Layout>
  );
}
