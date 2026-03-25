import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Save, Upload, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BlockEditor, { ContentBlock } from "@/components/BlockEditor";

interface BlogForm {
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  excerpt: string;
  content: ContentBlock[];
  hero_image_url: string;
  hero_image_alt: string;
  author: string;
  category: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  published_at: string;
}

const emptyForm: BlogForm = {
  title: "", slug: "", status: "draft", featured: false,
  excerpt: "", content: [], hero_image_url: "", hero_image_alt: "",
  author: "", category: "", tags: [],
  seo_title: "", seo_description: "", seo_keywords: [],
  published_at: "",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function TagEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add item and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const v = input.trim();
              if (v && !items.includes(v)) { onChange([...items, v]); setInput(""); }
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => {
          const v = input.trim();
          if (v && !items.includes(v)) { onChange([...items, v]); setInput(""); }
        }}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
              {item}
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminBlogEditor() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAdminApi();
  const isNew = id === "new";
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [originalForm, setOriginalForm] = useState<BlogForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const baseUrl = import.meta.env.VITE_SUPABASE_PROJECT_ID
    ? `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`
    : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  useEffect(() => {
    if (!isAdmin) { navigate("/admin-login"); return; }
    if (!isNew && id) loadPost(id);
  }, [isAdmin, id]);

  const loadPost = async (postId: string) => {
    try {
      const res = await fetch(`${baseUrl}/admin-blog?id=${postId}`, {
        headers: { "Content-Type": "application/json", "x-admin-token": token || "" },
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      // Handle legacy string content by converting to a paragraph block
      let contentBlocks: ContentBlock[] = [];
      if (Array.isArray(data.content)) {
        contentBlocks = data.content;
      } else if (typeof data.content === "string" && data.content) {
        contentBlocks = [{ id: "migrated-1", type: "paragraph", content: data.content }];
      }
      const loaded: BlogForm = {
        ...emptyForm,
        ...data,
        content: contentBlocks,
        tags: data.tags || [],
        seo_keywords: data.seo_keywords || [],
        published_at: data.published_at || "",
      };
      setForm(loaded);
      setOriginalForm(loaded);
    } catch {
      toast.error("Failed to load blog post");
      navigate("/admin");
    }
  };

  const updateField = (field: keyof BlogForm, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && (isNew || prev.slug === slugify(prev.title))) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      let payload: any;
      if (isNew) {
        const { ...cleanForm } = form as any;
        delete cleanForm.created_at;
        delete cleanForm.updated_at;
        if (!cleanForm.published_at) delete cleanForm.published_at;
        payload = cleanForm;
      } else {
        const changes: any = { id };
        const orig = originalForm || emptyForm;
        for (const key of Object.keys(form)) {
          if (key === "created_at" || key === "updated_at") continue;
          if (JSON.stringify((form as any)[key]) !== JSON.stringify((orig as any)[key])) {
            changes[key] = (form as any)[key];
          }
        }
        if (!changes.slug) changes.slug = form.slug;
        payload = changes;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(`${baseUrl}/admin-blog`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": token || "" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Request failed");
      }
      toast.success(isNew ? "Blog post created!" : "Blog post updated!");
      setOriginalForm({ ...form });
      if (isNew) navigate("/admin");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("retreat-images").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("retreat-images").getPublicUrl(path);
      updateField("hero_image_url", urlData.publicUrl);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <span className="text-muted-foreground text-sm">
            {isNew ? "New Blog Post" : "Edit Blog Post"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={form.featured}
              onCheckedChange={(checked) => updateField("featured", !!checked)}
            />
            <Label htmlFor="featured" className="text-sm cursor-pointer">Featured</Label>
          </div>
          <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="sage" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* CONTENT TAB */}
          <TabsContent value="content" className="space-y-6">
            <FieldGroup label="Title *">
              <Input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Blog post title" />
            </FieldGroup>
            <FieldGroup label="Slug">
              <Input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="auto-generated-from-title" />
            </FieldGroup>
            <FieldGroup label="Excerpt">
              <Textarea value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} rows={3} placeholder="Brief summary shown in listings..." />
            </FieldGroup>

            {/* Block Editor */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">Content</Label>
              <div className="border border-border rounded-lg p-4 min-h-[300px] bg-card">
                <BlockEditor
                  blocks={form.content}
                  onChange={(blocks) => updateField("content", blocks)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Author">
                <Input value={form.author} onChange={(e) => updateField("author", e.target.value)} placeholder="Author name" />
              </FieldGroup>
              <FieldGroup label="Category">
                <Input value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="e.g. Wellness, Travel" />
              </FieldGroup>
            </div>
            <FieldGroup label="Published Date">
              <Input type="datetime-local" value={form.published_at ? form.published_at.slice(0, 16) : ""} onChange={(e) => updateField("published_at", e.target.value ? new Date(e.target.value).toISOString() : "")} />
            </FieldGroup>
            <TagEditor label="Tags" items={form.tags} onChange={(items) => updateField("tags", items)} />
          </TabsContent>

          {/* MEDIA TAB */}
          <TabsContent value="media" className="space-y-6">
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h3 className="font-medium text-foreground">Hero Image</h3>
              {form.hero_image_url && (
                <div className="relative inline-block">
                  <img src={form.hero_image_url} alt={form.hero_image_alt || "Hero"} className="max-h-48 rounded-lg object-cover" />
                  <button
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => updateField("hero_image_url", "")}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload Hero Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              <FieldGroup label="Hero Image Alt Text">
                <Input value={form.hero_image_alt} onChange={(e) => updateField("hero_image_alt", e.target.value)} placeholder="Descriptive alt text for SEO" />
              </FieldGroup>
            </div>
          </TabsContent>

          {/* SEO TAB */}
          <TabsContent value="seo" className="space-y-6">
            <FieldGroup label="SEO Title">
              <Input value={form.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} placeholder="Custom title for search engines (defaults to post title)" />
              <p className="text-xs text-muted-foreground mt-1">{form.seo_title.length}/60 characters recommended</p>
            </FieldGroup>
            <FieldGroup label="Meta Description">
              <Textarea value={form.seo_description} onChange={(e) => updateField("seo_description", e.target.value)} rows={3} placeholder="Brief description for search engine results..." />
              <p className="text-xs text-muted-foreground mt-1">{form.seo_description.length}/160 characters recommended</p>
            </FieldGroup>
            <TagEditor label="SEO Keywords" items={form.seo_keywords} onChange={(items) => updateField("seo_keywords", items)} />
            
            {/* SEO Preview */}
            <div className="border border-border rounded-lg p-5 space-y-2">
              <h3 className="font-medium text-foreground mb-3">Search Engine Preview</h3>
              <p className="text-[#1a0dab] text-lg leading-tight truncate">
                {form.seo_title || form.title || "Blog Post Title"}
              </p>
              <p className="text-[#006621] text-sm truncate">
                yoursite.com/blog/{form.slug || "post-slug"}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {form.seo_description || form.excerpt || "Post description will appear here..."}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
