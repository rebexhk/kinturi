import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

interface Retreat {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  country: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  duration: string | null;
}

export function RelatedRetreats({ ids }: { ids: string[] }) {
  const { data: retreats } = useQuery({
    queryKey: ["related-retreats", ids],
    enabled: ids && ids.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retreats")
        .select("id, title, slug, location, country, hero_image_url, hero_image_alt, duration")
        .in("id", ids)
        .eq("status", "published");
      if (error) throw error;
      // Preserve admin-defined order
      const map = new Map((data as Retreat[]).map((r) => [r.id, r]));
      return ids.map((id) => map.get(id)).filter(Boolean) as Retreat[];
    },
  });

  if (!ids?.length || !retreats?.length) return null;

  return (
    <section className="bg-secondary section-padding">
      <div className="container-page max-w-5xl">
        <h2 className="heading-card text-foreground mb-2 text-center">Continue exploring</h2>
        <p className="text-body text-center mb-10">
          Retreats that match the spirit of this story.
        </p>

        <div className={`grid gap-6 ${
          retreats.length === 1
            ? "max-w-md mx-auto"
            : retreats.length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-3"
        }`}>
          {retreats.map((r) => (
            <Link
              key={r.id}
              to={`/retreats/${r.slug}`}
              className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
            >
              {r.hero_image_url && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={r.hero_image_url}
                    alt={r.hero_image_alt || r.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs tracking-wide uppercase text-primary font-medium mb-1.5">
                  {[r.location, r.country].filter(Boolean).join(", ")}
                </p>
                <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {r.title}
                </h3>
                {r.duration && (
                  <p className="text-small mb-3">{r.duration}</p>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-foreground">
                  View retreat
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
