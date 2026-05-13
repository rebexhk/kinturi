import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, hero_image_url, hero_image_alt, author, published_at, tags")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Kinturi Blog — Active Escape Guides &amp; Inspiration</title>
        <meta name="description" content="Expert guides, retreat reviews, and inspiration for your next fitness holiday. Discover the best active escapes around the world." />
        <link rel="canonical" href="https://kinturi.lovable.app/blog" />
        <meta property="og:title" content="Kinturi Blog — Active Escape Guides &amp; Inspiration" />
        <meta property="og:description" content="Expert guides, retreat reviews, and inspiration for your next fitness holiday. Discover the best active escapes around the world." />
        <meta property="og:url" content="https://kinturi.lovable.app/blog" />
      </Helmet>
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6">Journal</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Insights, tips, and inspiration for your next active escape.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-page">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : !posts?.length ? (
            <p className="text-center text-muted-foreground py-16">No posts yet — check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {posts.map((post) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.id}
                  className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
                >
                  {post.hero_image_url && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.hero_image_url}
                        alt={post.hero_image_alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <span className="text-xs tracking-wide uppercase text-primary font-medium">
                          {post.category}
                        </span>
                      )}
                      {post.category && post.published_at && (
                        <span className="text-muted-foreground">·</span>
                      )}
                      {post.published_at && (
                        <span className="text-small">{formatDate(post.published_at)}</span>
                      )}
                    </div>
                    <h2 className="heading-card text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="text-body">{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
