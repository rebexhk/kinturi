import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onInsert: (label: string, url: string) => void;
  initialLabel?: string;
  initialUrl?: string;
}

interface RetreatOption {
  id: string;
  title: string;
  slug: string;
  location: string | null;
}

export function CtaButtonDialog({ open, onOpenChange, onInsert, initialLabel = "", initialUrl = "" }: Props) {
  const [label, setLabel] = useState(initialLabel);
  const [url, setUrl] = useState(initialUrl);
  const [retreats, setRetreats] = useState<RetreatOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLabel(initialLabel);
    setUrl(initialUrl);
    setLoading(true);
    supabase
      .from("retreats")
      .select("id, title, slug, location")
      .eq("status", "published")
      .order("title", { ascending: true })
      .then(({ data }) => {
        setRetreats((data as RetreatOption[]) || []);
        setLoading(false);
      });
  }, [open, initialLabel, initialUrl]);

  const handlePickRetreat = (slug: string) => {
    const r = retreats.find((x) => x.slug === slug);
    if (!r) return;
    setUrl(`/retreats/${r.slug}`);
    if (!label) setLabel(`View ${r.title}`);
  };

  const submit = () => {
    const l = label.trim();
    const u = url.trim();
    if (!l || !u) return;
    onInsert(l, u);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert call-to-action button</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Link to a retreat (optional)</Label>
            <Select onValueChange={handlePickRetreat}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading retreats…" : "Pick a retreat to auto-fill"} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {retreats.map((r) => (
                  <SelectItem key={r.id} value={r.slug}>
                    {r.title}
                    {r.location ? ` — ${r.location}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Or enter any URL manually below.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Button label *</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. View this retreat"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Link URL *</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/retreats/your-slug or https://…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="sage" onClick={submit} disabled={!label.trim() || !url.trim()}>
            Insert button
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
