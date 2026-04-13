import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ChevronDown, Search, Sparkles, MapPin } from "lucide-react";
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

const PLACEHOLDERS = [
  "I'm looking for a crossfit retreat somewhere warm with great food...",
  "A yoga retreat in Europe for solo travellers, under £2,000...",
  "Something adventurous with hiking, for a group of friends...",
  "A beginner-friendly surf trip with good nightlife nearby...",
];

const DEMO_RESULTS = [
  {
    title: "Algarve Reformer & Restore",
    location: "Portugal",
    reason: "Matched because: beginner yoga programme, warm climate, solo-traveller friendly atmosphere",
  },
  {
    title: "Ibiza Strength & Sun Retreat",
    location: "Spain",
    reason: "Matched because: warm European destination, group-friendly, varied fitness levels welcome",
  },
  {
    title: "Tuscany Wellness Escape",
    location: "Italy",
    reason: "Matched because: solo-friendly, Mediterranean warmth, gentle morning yoga sessions",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredRetreats, setFeaturedRetreats] = useState<FeaturedRetreat[]>([]);
  const [reviewStats, setReviewStats] = useState<Record<string, { avg: number; count: number }>>({});
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          <p className="text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto font-light md:text-2xl">
            Discover a curated selection of fitness-focused holidays and active escapes worldwide.
          </p>

          <p className="text-base text-primary-foreground/80 mb-2 max-w-2xl mx-auto font-light">
            Tell us what you're looking for — we'll find the retreat that fits you perfectly.
          </p>

          {/* AI Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim().length >= 3) {
                navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="max-w-3xl mx-auto w-full mb-2"
          >
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={PLACEHOLDERS[placeholderIdx]}
                className="pl-12 pr-28 h-16 text-base md:text-lg rounded-full bg-white/15 backdrop-blur-lg border-white/25 text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:ring-white/30 shadow-lg"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 text-primary-foreground border-0 gap-1.5"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </form>

          {/* Demoted CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" asChild className="text-sm">
              <Link to="/retreats">
                Explore Retreats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild className="text-sm">
              <Link to="/contact">Request to Book</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-delay-2">
          <ChevronDown className="h-6 w-6 text-primary-foreground/60 animate-bounce" />
        </div>
      </section>

      {/* See It In Action Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-page max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-4 animate-fade-in-up">
              Search that actually understands you
            </h2>
            <p className="text-body text-lg max-w-2xl mx-auto">
              Not just keywords — describe your ideal trip and our AI does the rest.
            </p>
          </div>

          {/* Static mockup */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <div className="pl-12 pr-6 h-14 flex items-center rounded-full bg-background border border-border text-foreground text-base shadow-sm">
                Solo yoga retreat in Europe, warm weather, beginner-friendly
              </div>
            </div>
          </div>

          {/* Sample result cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {DEMO_RESULTS.map((result) => (
              <div
                key={result.title}
                className="bg-background rounded-lg p-5 shadow-soft border border-border"
              >
                <h4 className="font-serif text-base font-medium text-foreground mb-1">
                  {result.title}
                </h4>
                <p className="text-small flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3" />
                  {result.location}
                </p>
                <p className="text-xs text-primary/80 italic leading-relaxed">
                  {result.reason}
                </p>
              </div>
            ))}
          </div>
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
                title: "Describe What You Want",
                description:
                  "Just tell our AI what you're looking for in plain English — activity type, mood, budget, destination, travel dates. It understands natural language and finds retreats that actually fit you.",
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
