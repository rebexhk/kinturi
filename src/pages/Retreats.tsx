import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Retreat {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  type: string;
  description: string;
  price: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  tags: string[] | null;
}

export default function Retreats() {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetreats = async () => {
      const { data, error } = await supabase
        .from("retreats")
        .select("id, title, slug, location, duration, type, description, price, hero_image_url, hero_image_alt, tags")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRetreats(data);
      }
      setLoading(false);
    };
    fetchRetreats();
  }, []);

  // Collect unique tags from all retreats
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    retreats.forEach((r) => r.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [retreats]);

  const filtered = activeTag
    ? retreats.filter((r) => r.tags?.includes(activeTag))
    : retreats;

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
      {allTags.length > 0 && (
        <section className="py-8 border-b border-border bg-background">
          <div className="container-page flex flex-wrap gap-3 justify-center">
            <Button
              variant={activeTag === null ? "sage" : "outline"}
              size="sm"
              onClick={() => setActiveTag(null)}
            >
              All Retreats
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? "sage" : "outline"}
                size="sm"
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Button>
            ))}
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
                {activeTag ? `No retreats found for "${activeTag}".` : "No retreats available yet. Check back soon!"}
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
                    <p className="text-small mb-4">{retreat.location}</p>
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
