import { useEffect, useState, useMemo } from "react";
import { useAdminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Download, Search } from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export function SubscribersAdmin() {
  const { adminFetch } = useAdminApi();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubscribers = async () => {
    try {
      const data = await adminFetch("admin-newsletter");
      setSubscribers(data);
    } catch {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, search]);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove ${email} from the subscriber list?`)) return;
    try {
      await adminFetch(`admin-newsletter?id=${id}`, { method: "DELETE" });
      toast.success("Subscriber removed");
      fetchSubscribers();
    } catch {
      toast.error("Failed to remove subscriber");
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const rows = [
      ["email", "subscribed_at"],
      ...subscribers.map((s) => [s.email, s.created_at]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kinturi-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"} on The Kinturi Edit
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={subscribers.length === 0}>
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>

      {!loading && subscribers.length > 0 && (
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {loading ? (
        <div className="text-muted-foreground">Loading subscribers...</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">No subscribers yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-soft transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{s.email}</p>
                <p className="text-xs text-muted-foreground">
                  Subscribed {new Date(s.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(s.id, s.email)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No matches</p>
          )}
        </div>
      )}
    </div>
  );
}
