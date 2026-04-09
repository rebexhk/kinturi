import { useEffect, useState, useMemo } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate, Link } from "react-router-dom";
import { useAdminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, LogOut, Edit, Trash2, Eye, EyeOff, MessageSquare, Upload, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface RetreatListItem {
  id: string;
  title: string;
  location: string;
  country: string;
  status: string;
  type: string;
  price: string;
  updated_at: string;
}

interface BlogListItem {
  id: string;
  title: string;
  status: string;
  category: string;
  author: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const { adminFetch } = useAdminApi();
  const [retreats, setRetreats] = useState<RetreatListItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterCity, setFilterCity] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  const countries = useMemo(() => 
    [...new Set(retreats.map(r => r.country).filter(Boolean))].sort(),
    [retreats]
  );

  const cities = useMemo(() => {
    const filtered = filterCountry ? retreats.filter(r => r.country === filterCountry) : retreats;
    return [...new Set(filtered.map(r => r.location?.split(",")[0]?.trim()).filter(Boolean))].sort();
  }, [retreats, filterCountry]);

  const types = useMemo(() => {
    let filtered = retreats;
    if (filterCountry) filtered = filtered.filter(r => r.country === filterCountry);
    if (filterCity) filtered = filtered.filter(r => r.location?.split(",")[0]?.trim() === filterCity);
    const allTypes = filtered.flatMap(r => r.type ? r.type.split(",").map(t => t.trim()) : []);
    return [...new Set(allTypes)].sort();
  }, [retreats, filterCountry, filterCity]);

  const filteredRetreats = useMemo(() => {
    let result = retreats;
    if (filterCountry) result = result.filter(r => r.country === filterCountry);
    if (filterCity) result = result.filter(r => r.location?.split(",")[0]?.trim() === filterCity);
    if (filterType) result = result.filter(r => r.type?.includes(filterType));
    return result;
  }, [retreats, filterCountry, filterCity, filterType]);

  const hasActiveFilters = filterCountry || filterCity || filterType;
  const clearFilters = () => { setFilterCountry(""); setFilterCity(""); setFilterType(""); };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
      return;
    }
    fetchRetreats();
    fetchBlogPosts();
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

  const fetchBlogPosts = async () => {
    try {
      const data = await adminFetch("admin-blog");
      setBlogPosts(data);
    } catch (err) {
      toast.error("Failed to load blog posts");
    } finally {
      setBlogLoading(false);
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

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminFetch(`admin-blog?id=${id}`, { method: "DELETE" });
      toast.success("Blog post deleted");
      fetchBlogPosts();
    } catch {
      toast.error("Failed to delete blog post");
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

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const csvText = await file.text();
      const result = await adminFetch("admin-import-retreats", {
        method: "POST",
        body: JSON.stringify({ csv: csvText }),
      });
      if (result.errors?.length > 0) {
        toast.warning(`Imported ${result.inserted}/${result.total} retreats. ${result.errors.length} error(s).`, {
          description: result.errors.slice(0, 3).join('\n'),
          duration: 8000,
        });
      } else {
        toast.success(`Successfully imported ${result.inserted} retreat(s)`);
      }
      fetchRetreats();
    } catch (err: any) {
      toast.error(err.message || "CSV import failed");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggleBlogStatus = async (post: BlogListItem) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      await adminFetch("admin-blog", {
        method: "PUT",
        body: JSON.stringify({ id: post.id, status: newStatus }),
      });
      toast.success(`Blog post ${newStatus === "published" ? "published" : "unpublished"}`);
      fetchBlogPosts();
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
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-serif text-xl text-foreground">Kinturi</Link>
          <span className="text-muted-foreground text-sm">/ Admin CMS</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/reviews")}>
            <MessageSquare className="w-4 h-4 mr-1" /> Manage Reviews
          </Button>
        </div>

        <Tabs defaultValue="retreats" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-64">
            <TabsTrigger value="retreats">Retreats</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          {/* RETREATS TAB */}
          <TabsContent value="retreats">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-3xl text-foreground">Retreat Listings</h1>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVImport}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                >
                  <Upload className="w-4 h-4 mr-1" /> {importing ? "Importing..." : "Import CSV"}
                </Button>
                <Button variant="sage" size="sm" onClick={() => navigate("/admin/retreat/new")}>
                  <Plus className="w-4 h-4 mr-1" /> New Retreat
                </Button>
              </div>
            </div>

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
                      <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(retreat)} title={retreat.status === "published" ? "Unpublish" : "Publish"}>
                        {retreat.status === "published" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/retreat/${retreat.id}`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(retreat.id, retreat.title)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* BLOG TAB */}
          <TabsContent value="blog">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-3xl text-foreground">Blog Posts</h1>
              <Button variant="sage" size="sm" onClick={() => navigate("/admin/blog/new")}>
                <Plus className="w-4 h-4 mr-1" /> New Blog Post
              </Button>
            </div>

            {blogLoading ? (
              <div className="text-muted-foreground">Loading blog posts...</div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-4">No blog posts yet</p>
                <Button variant="sage" onClick={() => navigate("/admin/blog/new")}>
                  <Plus className="w-4 h-4 mr-1" /> Create Your First Blog Post
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-card border border-border rounded-lg p-5 flex items-center justify-between hover:shadow-soft transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {post.category || "Uncategorized"} {post.author ? `· ${post.author}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleToggleBlogStatus(post)} title={post.status === "published" ? "Unpublish" : "Publish"}>
                        {post.status === "published" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/blog/${post.id}`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteBlog(post.id, post.title)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
