import { Star } from "lucide-react";

interface ReviewSummaryProps {
  avgRating: number;
  count: number;
}

export function ReviewSummary({ avgRating, count }: ReviewSummaryProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? "text-accent fill-accent" : "text-border"}`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{avgRating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">
        ({count})
      </span>
    </div>
  );
}
