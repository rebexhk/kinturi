import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate, Link } from "react-router-dom";
import { useAdminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, LogOut, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface RetreatListItem {
  id: string;
  title: string;
  location: string;
  status: string;
  type: string;
  price: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const { adminFetch } = useAdminApi();
  const [retreats, setRetreats] = useState<RetreatListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
      return;
    }
    fetchRetreats();
  }, [isAdmin]);

  const fetchRetreats = async () => {
    try {
      const data = await adminFetch("admin-retreats");
      setRetreats(data);
    } catch (err) {
      toast.error("Failed to load retreats");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminFetch(`admin-retreats?id=${id}`, { method: "DELETE" });
      toast.success("Retreat deleted");
      fetchRetreats();
    } catch {
      toast.error("Failed to delete retreat");
    }
  };

  const handleToggleStatus = async (retreat: RetreatListItem) => {
    const newStatus = retreat.status === "published" ? "draft" : "published";
    try {
      await adminFetch("admin-retreats", {
        method: "PUT",
        body: JSON.stringify({ id: retreat.id, status: newStatus }),
      });
      toast.success(`Retreat ${newStatus === "published" ? "published" : "unpublished"}`);
      fetchRetreats();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-serif text-xl text-foreground">Kinturi</Link>
          <span className="text-muted-foreground text-sm">/ Admin CMS</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="sage" size="sm" onClick={() => navigate("/admin/retreat/new")}>
            <Plus className="w-4 h-4 mr-1" /> New Retreat
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl text-foreground mb-8">Retreat Listings</h1>

        {loading ? (
          <div className="text-muted-foreground">Loading retreats...</div>
        ) : retreats.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No retreats yet</p>
            <Button variant="sage" onClick={() => navigate("/admin/retreat/new")}>
              <Plus className="w-4 h-4 mr-1" /> Create Your First Retreat
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {retreats.map((retreat) => (
              <div
                key={retreat.id}
                className="bg-card border border-border rounded-lg p-5 flex items-center justify-between hover:shadow-soft transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-foreground truncate">{retreat.title}</h3>
                    <Badge variant={retreat.status === "published" ? "default" : "secondary"}>
                      {retreat.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {retreat.location} · {retreat.type} · {retreat.price}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(retreat)}
                    title={retreat.status === "published" ? "Unpublish" : "Publish"}
                  >
                    {retreat.status === "published" ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/retreat/${retreat.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(retreat.id, retreat.title)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
