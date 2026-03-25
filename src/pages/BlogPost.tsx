import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Post not found");
      return data;
    },
    enabled: !!slug,
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
      {isLoading ? (
        <div className="pt-32 pb-16">
          <div className="container-page max-w-3xl">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-12 w-full mb-6" />
            <Skeleton className="aspect-[16/9] w-full rounded-lg mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      ) : error || !post ? (
        <div className="pt-32 pb-16 text-center">
          <div className="container-page">
            <h1 className="heading-display text-foreground mb-4">Post not found</h1>
            <Link to="/blog" className="text-primary hover:underline">
              ← Back to Journal
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* SEO meta would go in a Helmet here */}
          <article className="pt-32 pb-16">
            <div className="container-page max-w-3xl">
              {/* Back link */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Journal
              </Link>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-4">
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
                {post.author && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-small">{post.author}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="heading-display text-foreground mb-8">{post.title}</h1>

              {/* Hero image */}
              {post.hero_image_url && (
                <div className="aspect-[16/9] overflow-hidden rounded-lg mb-10">
                  <img
                    src={post.hero_image_url}
                    alt={post.hero_image_alt || post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content — stored as HTML from TipTap */}
              <div
                className="tiptap prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content as string || "" }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </>
      )}
    </Layout>
  );
}
