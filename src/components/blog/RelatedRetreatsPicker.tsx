import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, ArrowUp, ArrowDown } from "lucide-react";

interface RetreatOption {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  hero_image_url: string | null;
}

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}

export function RelatedRetreatsPicker({ selectedIds, onChange, max = 3 }: Props) {
  const [retreats, setRetreats] = useState<RetreatOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("retreats")
      .select("id, title, slug, location, hero_image_url")
      .eq("status", "published")
      .order("title", { ascending: true })
      .then(({ data }) => {
        setRetreats((data as RetreatOption[]) || []);
        setLoading(false);
      });
  }, []);

  const byId = new Map(retreats.map((r) => [r.id, r]));
  const available = retreats.filter((r) => !selectedIds.includes(r.id));
  const atMax = selectedIds.length >= max;

  const add = (id: string) => {
    if (selectedIds.includes(id) || atMax) return;
    onChange([...selectedIds, id]);
  };
  const remove = (id: string) => onChange(selectedIds.filter((x) => x !== id));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...selectedIds];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground">Add a related retreat</Label>
        <Select
          key={selectedIds.length}
          onValueChange={add}
          disabled={loading || atMax || available.length === 0}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                loading
                  ? "Loading retreats…"
                  : atMax
                  ? `Maximum ${max} retreats selected`
                  : "Pick a retreat to add"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {available.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.title}
                {r.location ? ` — ${r.location}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          These appear as "Continue exploring" cards at the bottom of this post. Up to {max}.
        </p>
      </div>

      {selectedIds.length > 0 && (
        <ul className="space-y-2">
          {selectedIds.map((id, idx) => {
            const r = byId.get(id);
            return (
              <li
                key={id}
                className="flex items-center gap-3 border border-border rounded-lg p-2 bg-card"
              >
                {r?.hero_image_url ? (
                  <img
                    src={r.hero_image_url}
                    alt=""
                    className="w-14 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-14 h-14 bg-muted rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {r?.title || "(unknown retreat)"}
                  </p>
                  {r?.location && (
                    <p className="text-xs text-muted-foreground truncate">{r.location}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={idx === 0}
                    onClick={() => move(idx, -1)}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={idx === selectedIds.length - 1}
                    onClick={() => move(idx, 1)}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:text-destructive"
                    onClick={() => remove(id)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
