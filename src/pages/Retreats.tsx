import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewSummary } from "@/components/ReviewSummary";
import { FAQSection } from "@/components/FAQSection";
import { useCurrency, convertPriceString } from "@/contexts/CurrencyContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { currency, rates } = useCurrency();
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviewStats, setReviewStats] = useState<ReviewStats>({});

  const activeCountry = searchParams.get("country") || null;
  const activeCity = searchParams.get("city") || null;
  const activeType = searchParams.get("type") || null;

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

  // Extract city from location string (first part before comma)
  const getCity = (location: string) => {
    return location.split(",")[0].trim();
  };

  const allCountries = useMemo(() => {
    const set = new Set<string>();
    retreats.forEach((r) => { if (r.country) set.add(r.country); });
    return Array.from(set).sort();
  }, [retreats]);

  // Cities filtered by selected country
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    retreats
      .filter((r) => !activeCountry || r.country === activeCountry)
      .forEach((r) => set.add(getCity(r.location)));
    return Array.from(set).sort();
  }, [retreats, activeCountry]);

  // Types filtered by selected country + city
  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    retreats
      .filter((r) => {
        if (activeCountry && r.country !== activeCountry) return false;
        if (activeCity && getCity(r.location) !== activeCity) return false;
        return true;
      })
      .forEach((r) => (r.type || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [retreats, activeCountry, activeCity]);

  const filtered = useMemo(() => {
    return retreats.filter((r) => {
      if (activeCountry && r.country !== activeCountry) return false;
      if (activeCity && getCity(r.location) !== activeCity) return false;
      if (activeType && !(r.type || []).includes(activeType)) return false;
      return true;
    });
  }, [retreats, activeCountry, activeCity, activeType]);

  const updateFilter = (key: string, value: string | null, resetKeys: string[] = []) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    resetKeys.forEach((k) => next.delete(k));
    setSearchParams(next, { replace: true });
  };

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
      <section className="py-8 border-b border-border bg-background">
        <div className="container-page">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {/* Country */}
            <Select
              value={activeCountry || "__all__"}
              onValueChange={(v) => updateFilter("country", v === "__all__" ? null : v, ["city", "type"])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Countries</SelectItem>
                {allCountries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City */}
            <Select
              value={activeCity || "__all__"}
              onValueChange={(v) => updateFilter("city", v === "__all__" ? null : v, ["type"])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Cities</SelectItem>
                {availableCities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type */}
            <Select
              value={activeType || "__all__"}
              onValueChange={(v) => updateFilter("type", v === "__all__" ? null : v, [])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Types</SelectItem>
                {availableTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(activeCountry || activeCity || activeType) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchParams({}, { replace: true })}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      </section>

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
                {(activeType || activeCountry || activeCity) ? "No retreats match the selected filters." : "No retreats available yet. Check back soon!"}
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
                        {(retreat.type || []).join(" · ")}
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
                      <span className="font-serif text-lg text-foreground">{convertPriceString(retreat.price, currency, rates)}</span>
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

      {/* FAQ */}
      <FAQSection schemaId="faq-jsonld-retreats" />
    </Layout>
  );
}
