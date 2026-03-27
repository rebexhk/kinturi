import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewSummary } from "@/components/ReviewSummary";

interface Retreat {
  id: string;
  title: string;
  slug: string;
  location: string;
  country: string;
  duration: string;
  type: string[];
  description: string;
  price: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  tags: string[] | null;
}

interface ReviewStats {
  [retreatId: string]: { avg: number; count: number };
}

export default function Retreats() {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({});

  useEffect(() => {
    const fetchData = async () => {
      const [retreatsRes, reviewsRes] = await Promise.all([
        supabase
          .from("retreats")
          .select("id, title, slug, location, country, duration, type, description, price, hero_image_url, hero_image_alt, tags")
          .eq("status", "published")
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("retreat_id, rating"),
      ]);

      if (!retreatsRes.error && retreatsRes.data) {
        setRetreats(retreatsRes.data);
      }

      if (!reviewsRes.error && reviewsRes.data) {
        const stats: ReviewStats = {};
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

      setLoading(false);
    };
    fetchData();
  }, []);

  const allTypes = useMemo(() => {
    const set = new Set<string>();
    retreats.forEach((r) => { (r.type || []).forEach((t) => set.add(t)); });
    return Array.from(set).sort();
  }, [retreats]);

  const allCountries = useMemo(() => {
    const set = new Set<string>();
    retreats.forEach((r) => { if (r.country) set.add(r.country); });
    return Array.from(set).sort();
  }, [retreats]);

  const filtered = useMemo(() => {
    return retreats.filter((r) => {
      if (activeType && r.type !== activeType) return false;
      if (activeCountry && r.country !== activeCountry) return false;
      return true;
    });
  }, [retreats, activeType, activeCountry]);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6">Our Retreats</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Move, reset, and come back stronger. Every Kinturi retreat is chosen to leave you more energised than when you arrived.
          </p>
        </div>
      </section>

      {/* Filters */}
      {(allTypes.length > 0 || allCountries.length > 0) && (
        <section className="py-8 border-b border-border bg-background">
          <div className="container-page space-y-4">
            {allTypes.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="text-sm font-medium text-muted-foreground self-center mr-1">Type:</span>
                <Button
                  variant={activeType === null ? "sage" : "outline"}
                  size="sm"
                  onClick={() => setActiveType(null)}
                >
                  All
                </Button>
                {allTypes.map((type) => (
                  <Button
                    key={type}
                    variant={activeType === type ? "sage" : "outline"}
                    size="sm"
                    onClick={() => setActiveType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            )}
            {allCountries.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="text-sm font-medium text-muted-foreground self-center mr-1">Location:</span>
                <Button
                  variant={activeCountry === null ? "sage" : "outline"}
                  size="sm"
                  onClick={() => setActiveCountry(null)}
                >
                  All
                </Button>
                {allCountries.map((country) => (
                  <Button
                    key={country}
                    variant={activeCountry === country ? "sage" : "outline"}
                    size="sm"
                    onClick={() => setActiveCountry(country)}
                  >
                    {country}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Retreat Grid */}
      <section className="section-padding bg-background">
        <div className="container-page">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden shadow-soft">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-body text-lg text-muted-foreground">
                {(activeType || activeCountry) ? "No retreats match the selected filters." : "No retreats available yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {filtered.map((retreat) => (
                <Link
                  key={retreat.id}
                  to={`/retreats/${retreat.slug}`}
                  className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 block"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {retreat.hero_image_url ? (
                      <img
                        src={retreat.hero_image_url}
                        alt={retreat.hero_image_alt || retreat.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs tracking-wide uppercase text-primary font-medium">
                        {retreat.type}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-small">{retreat.duration}</span>
                    </div>
                    <h3 className="heading-card text-foreground mb-2">
                      {retreat.title}
                    </h3>
                    <p className="text-small mb-2">{retreat.location}</p>
                    {reviewStats[retreat.id] && (
                      <div className="mb-3">
                        <ReviewSummary avgRating={reviewStats[retreat.id].avg} count={reviewStats[retreat.id].count} />
                      </div>
                    )}
                    <p className="text-body mb-6 line-clamp-3">{retreat.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg text-foreground">{retreat.price}</span>
                      <Button variant="sage-outline" size="sm" tabIndex={-1}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container-page text-center">
          <p className="text-body text-lg mb-6">
            Can't find what you're looking for?
          </p>
          <Button variant="sage" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
