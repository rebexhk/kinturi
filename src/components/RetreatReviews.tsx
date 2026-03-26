import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  admin_reply: string | null;
  created_at: string;
}

export function RetreatReviews({ retreatId }: { retreatId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id, reviewer_name, rating, comment, admin_reply, created_at")
        .eq("retreat_id", retreatId)
        .order("created_at", { ascending: false });
      if (data) setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [retreatId]);

  if (loading || reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-primary" />
        Guest Reviews
      </h2>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < Math.round(avgRating) ? "text-accent fill-accent" : "text-border"}`}
            />
          ))}
        </div>
        <span className="font-serif text-xl text-foreground">{avgRating.toFixed(1)}</span>
        <span className="text-muted-foreground text-sm">
          ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
        </span>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">{review.reviewer_name}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < review.rating ? "text-accent fill-accent" : "text-border"}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="text-body">{review.comment}</p>
            {review.admin_reply && (
              <div className="mt-3 ml-4 pl-4 border-l-2 border-primary/30">
                <p className="text-sm font-medium text-primary mb-1">Response from Kinturi</p>
                <p className="text-body text-sm">{review.admin_reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
