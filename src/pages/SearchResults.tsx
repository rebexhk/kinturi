import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Sparkles, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MatchResult {
  slug: string;
  title: string;
  location: string;
  country: string;
  type: string[];
  duration: string;
  price: string;
  hero_image_url: string | null;
  reason: string;
  score: number;
}

interface SearchResponse {
  topMatches: MatchResult[];
  alternatives: MatchResult[];
  summary: string;
  error?: string;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newQuery, setNewQuery] = useState(query);

  useEffect(() => {
    if (!query) return;
    const search = async () => {
      setLoading(true);
      setError(null);
      setResults(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke("ai-retreat-search", {
          body: { query },
        });
        if (fnError) throw fnError;
        if (data?.error) {
          setError(data.error);
        } else {
          setResults(data as SearchResponse);
        }
      } catch (e: any) {
        setError(e.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim().length >= 3) {
      navigate(`/search-results?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-32 pb-16">
        <div className="container-page max-w-4xl mx-auto">
          {/* Search again bar */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="Describe your perfect retreat..."
                className="pl-12 pr-24 h-14 text-base rounded-full border-primary/20 focus-visible:ring-primary/30"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-20 animate-fade-in">
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
              <h2 className="heading-section text-foreground mb-2">Finding your perfect retreat...</h2>
              <p className="text-body text-lg">Our AI is matching your preferences with our curated retreats</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-body text-lg mb-6">{error}</p>
              <Button variant="sage-outline" onClick={() => navigate("/retreats")}>
                Browse All Retreats
              </Button>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div className="animate-fade-in">
              {/* Summary */}
              {results.summary && (
                <div className="mb-10 p-6 bg-secondary rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-body text-lg">{results.summary}</p>
                  </div>
                </div>
              )}

              {/* Top Matches */}
              {results.topMatches.length > 0 && (
                <div className="mb-12">
                  <h2 className="heading-section text-foreground mb-6">Top Matches</h2>
                  <div className="space-y-6">
                    {results.topMatches.map((match) => (
                      <Link
                        key={match.slug}
                        to={`/retreats/${match.slug}`}
                        className="group block bg-background border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-80 aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0">
                            <img
                              src={match.hero_image_url || "/placeholder.svg"}
                              alt={match.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-6 flex-1">
                            <span className="text-xs tracking-wide uppercase text-primary font-medium">
                              {(match.type || []).join(" · ")}
                            </span>
                            <h3 className="heading-card text-foreground mt-2 mb-1 group-hover:text-primary transition-colors">
                              {match.title}
                            </h3>
                            <p className="text-small mb-3">
                              {match.location} · {match.duration} · from {convertPriceString(match.price, currency, rates)}
                            </p>
                            <p className="text-body text-sm leading-relaxed">{match.reason}</p>
                            <span className="inline-flex items-center text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                              View Retreat <ArrowRight className="ml-1 h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {results.alternatives.length > 0 && (
                <div className="mb-12">
                  <h2 className="heading-section text-foreground mb-6">Also Worth Considering</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.alternatives.map((alt) => (
                      <Link
                        key={alt.slug}
                        to={`/retreats/${alt.slug}`}
                        className="group block bg-background border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={alt.hero_image_url || "/placeholder.svg"}
                            alt={alt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5">
                          <span className="text-xs tracking-wide uppercase text-primary font-medium">
                            {(alt.type || []).join(" · ")}
                          </span>
                          <h3 className="font-serif text-lg font-medium text-foreground mt-1 mb-1 group-hover:text-primary transition-colors">
                            {alt.title}
                          </h3>
                          <p className="text-small mb-2">{alt.location} · {alt.duration}</p>
                          <p className="text-body text-sm leading-relaxed">{alt.reason}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {results.topMatches.length === 0 && results.alternatives.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-body text-lg mb-6">We couldn't find a strong match for your query. Try browsing all our retreats instead.</p>
                  <Button variant="sage-outline" asChild>
                    <Link to="/retreats">Browse All Retreats</Link>
                  </Button>
                </div>
              )}

              {/* Browse all CTA */}
              {(results.topMatches.length > 0 || results.alternatives.length > 0) && (
                <div className="text-center pt-4">
                  <Button variant="sage-outline" size="lg" asChild>
                    <Link to="/retreats">
                      Browse All Retreats
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
