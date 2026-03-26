import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate, useParams, Link } from "react-router-dom";
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

interface RetreatForm {
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  location: string;
  country: string;
  address: string;
  duration: string;
  type: string;
  description: string;
  price: string;
  group_size: string;
  level: string;
  hero_image_url: string;
  hero_image_alt: string;
  gallery_image_urls: string[];
  gallery_image_alts: string[];
  accommodation_image_urls: string[];
  accommodation_image_alts: string[];
  dining_image_urls: string[];
  dining_image_alts: string[];
  dates: Array<{ start: string; end: string; availability: string }>;
  instructor: { name: string; bio: string; certifications: string[]; photo_url: string };
  accommodation: { description: string; options: Array<{ type: string; description: string; price: string }> };
  inclusions: string[];
  not_included: string[];
  menu: { description: string; highlights: string[] };
  facilities: string[];
  schedule: Array<{ time: string; activity: string }>;
  // SEO
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  categories: string[];
  tags: string[];
}

const emptyForm: RetreatForm = {
  title: "", slug: "", status: "draft", featured: false, location: "", country: "", address: "",
  duration: "", type: "", description: "", price: "", group_size: "", level: "",
  hero_image_url: "", hero_image_alt: "",
  gallery_image_urls: [], gallery_image_alts: [],
  accommodation_image_urls: [], accommodation_image_alts: [],
  dining_image_urls: [], dining_image_alts: [],
  dates: [], instructor: { name: "", bio: "", certifications: [], photo_url: "" },
  accommodation: { description: "", options: [] },
  inclusions: [], not_included: [], menu: { description: "", highlights: [] },
  facilities: [], schedule: [],
  seo_title: "", seo_description: "", seo_keywords: [], categories: [], tags: [],
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminRetreatEditor() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { id } = useParams();
  const { adminFetch, token } = useAdminApi();
  const isNew = id === "new";
  const [form, setForm] = useState<RetreatForm>(emptyForm);
  const [originalForm, setOriginalForm] = useState<RetreatForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate("/admin-login"); return; }
    if (!isNew && id) loadRetreat(id);
  }, [isAdmin, id]);

  const loadRetreat = async (retreatId: string) => {
    try {
      const data = await adminFetch(`admin-retreats?id=${retreatId}`);
      const loaded: RetreatForm = {
        ...emptyForm,
        ...data,
        gallery_image_urls: data.gallery_image_urls || [],
        gallery_image_alts: data.gallery_image_alts || [],
        accommodation_image_urls: data.accommodation_image_urls || [],
        accommodation_image_alts: data.accommodation_image_alts || [],
        dining_image_urls: data.dining_image_urls || [],
        dining_image_alts: data.dining_image_alts || [],
        hero_image_alt: data.hero_image_alt || "",
        country: data.country || (data.location ? data.location.split(",").map((s: string) => s.trim()).pop() || "" : ""),
        dates: data.dates || [],
        instructor: data.instructor || emptyForm.instructor,
        accommodation: data.accommodation || emptyForm.accommodation,
        inclusions: data.inclusions || [],
        not_included: data.not_included || [],
        menu: data.menu || emptyForm.menu,
        facilities: data.facilities || [],
        schedule: data.schedule || [],
        seo_keywords: data.seo_keywords || [],
        categories: data.categories || [],
        tags: data.tags || [],
      };
      setForm(loaded);
      setOriginalForm(loaded);
    } catch {
      toast.error("Failed to load retreat");
      navigate("/admin");
    }
  };

  const extractCountry = (location: string): string => {
    const parts = location.split(",").map((s) => s.trim());
    return parts.length > 1 ? parts[parts.length - 1] : "";
  };

  const updateField = (field: keyof RetreatForm, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && (isNew || prev.slug === slugify(prev.title))) {
        next.slug = slugify(value);
      }
      if (field === "location") {
        next.country = extractCountry(value as string);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.location || !form.duration || !form.type || !form.description || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      let payload: any;
      if (isNew) {
        const { created_at, updated_at, ...cleanForm } = form as any;
        payload = cleanForm;
      } else {
        // Only send changed fields to keep payload small
        const changes: any = { id };
        const orig = originalForm || emptyForm;
        for (const key of Object.keys(form)) {
          if (key === 'created_at' || key === 'updated_at') continue;
          const current = JSON.stringify((form as any)[key]);
          const original = JSON.stringify((orig as any)[key]);
          if (current !== original) {
            changes[key] = form[key];
          }
        }
        // Always include slug for identification
        if (!changes.slug) changes.slug = form.slug;
        payload = changes;
      }
      
      const url = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/admin-retreats`;
      
      // Retry up to 3 times on network failures
      let lastError: Error | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);
          
          const response = await fetch(url, {
            method: isNew ? "POST" : "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": token || "",
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            const err = await response.json().catch(() => ({ error: "Request failed" }));
            throw new Error(err.error || "Request failed");
          }
          
          const savedData = await response.json();
          toast.success(isNew ? "Retreat created!" : "Retreat updated!");
          // Update originalForm so subsequent saves only send new changes
          setOriginalForm({ ...form });
          if (isNew) {
            navigate("/admin");
          }
          return;
        } catch (err: any) {
          lastError = err;
          if (err.name === 'AbortError') {
            console.log(`[save] Attempt ${attempt + 1} timed out, retrying...`);
          } else if (err.message === 'Failed to fetch') {
            console.log(`[save] Attempt ${attempt + 1} network error, retrying...`);
            await new Promise(r => setTimeout(r, 1000));
          } else {
            throw err; // Non-network error, don't retry
          }
        }
      }
      throw lastError || new Error("Failed to save after retries");
    } catch (err: any) {
      console.error("[save] error:", err);
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "hero" | "gallery" | "accommodation" | "dining") => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("retreat-images").upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("retreat-images").getPublicUrl(path);
        if (field === "hero") {
          updateField("hero_image_url", urlData.publicUrl);
        } else {
          newUrls.push(urlData.publicUrl);
        }
      }
      if (newUrls.length > 0) {
        const arrayField = field === "gallery" ? "gallery_image_urls" 
          : field === "accommodation" ? "accommodation_image_urls" 
          : "dining_image_urls";
        setForm(prev => ({
          ...prev,
          [arrayField]: [...(prev as any)[arrayField], ...newUrls],
        }));
      }
      toast.success(`${files.length} image${files.length > 1 ? 's' : ''} uploaded!`);
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <span className="text-muted-foreground text-sm">
            {isNew ? "New Retreat" : "Edit Retreat"}
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

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* CONTENT TAB */}
          <TabsContent value="content" className="space-y-6">
            <FieldGroup label="Title *">
              <Input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Cotswolds Pilates & Wellness Escape" />
            </FieldGroup>
            <FieldGroup label="Slug">
              <Input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="auto-generated-from-title" />
            </FieldGroup>
            <FieldGroup label="Description *">
              <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={5} placeholder="Full retreat description..." />
            </FieldGroup>
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="Location *">
                <Input value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Cotswolds, United Kingdom" />
              </FieldGroup>
              <FieldGroup label="Country (auto)">
                <Input value={form.country} onChange={(e) => updateField("country", e.target.value)} placeholder="Auto-extracted from location" className="bg-muted" />
              </FieldGroup>
              <FieldGroup label="Address">
                <Input value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="e.g. Langley Manor, Burford" />
              </FieldGroup>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="Type *">
                <Input value={form.type} onChange={(e) => updateField("type", e.target.value)} placeholder="e.g. Mat & Reformer Pilates" />
              </FieldGroup>
              <FieldGroup label="Duration *">
                <Input value={form.duration} onChange={(e) => updateField("duration", e.target.value)} placeholder="e.g. 5 nights" />
              </FieldGroup>
              <FieldGroup label="Price *">
                <Input value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="e.g. From £1,850" />
              </FieldGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Group Size">
                <Input value={form.group_size} onChange={(e) => updateField("group_size", e.target.value)} placeholder="e.g. Maximum 8 guests" />
              </FieldGroup>
              <FieldGroup label="Level">
                <Input value={form.level} onChange={(e) => updateField("level", e.target.value)} placeholder="e.g. All levels welcome" />
              </FieldGroup>
            </div>

            {/* Instructor */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h3 className="font-medium text-foreground">Instructor</h3>
              <FieldGroup label="Name">
                <Input value={form.instructor.name} onChange={(e) => updateField("instructor", { ...form.instructor, name: e.target.value })} />
              </FieldGroup>
              <FieldGroup label="Bio">
                <Textarea value={form.instructor.bio} onChange={(e) => updateField("instructor", { ...form.instructor, bio: e.target.value })} rows={3} />
              </FieldGroup>
              <ListEditor label="Certifications" items={form.instructor.certifications} onChange={(items) => updateField("instructor", { ...form.instructor, certifications: items })} />
            </div>
          </TabsContent>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="space-y-6">
            {/* Dates */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Available Dates</h3>
                <Button variant="outline" size="sm" onClick={() => updateField("dates", [...form.dates, { start: "", end: "", availability: "Available" }])}>
                  <Plus className="w-3 h-3 mr-1" /> Add Date
                </Button>
              </div>
              {form.dates.map((date, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 items-end">
                  <FieldGroup label="Start">
                    <Input value={date.start} onChange={(e) => {
                      const updated = [...form.dates];
                      updated[i] = { ...date, start: e.target.value };
                      updateField("dates", updated);
                    }} placeholder="20 March 2026" />
                  </FieldGroup>
                  <FieldGroup label="End">
                    <Input value={date.end} onChange={(e) => {
                      const updated = [...form.dates];
                      updated[i] = { ...date, end: e.target.value };
                      updateField("dates", updated);
                    }} placeholder="25 March 2026" />
                  </FieldGroup>
                  <FieldGroup label="Availability">
                    <Input value={date.availability} onChange={(e) => {
                      const updated = [...form.dates];
                      updated[i] = { ...date, availability: e.target.value };
                      updateField("dates", updated);
                    }} placeholder="Available" />
                  </FieldGroup>
                  <Button variant="ghost" size="sm" className="text-destructive mb-0.5" onClick={() => updateField("dates", form.dates.filter((_, j) => j !== i))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Accommodation */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h3 className="font-medium text-foreground">Accommodation</h3>
              <FieldGroup label="Description">
                <Textarea value={form.accommodation.description} onChange={(e) => updateField("accommodation", { ...form.accommodation, description: e.target.value })} rows={3} />
              </FieldGroup>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Room Options</Label>
                <Button variant="outline" size="sm" onClick={() => updateField("accommodation", { ...form.accommodation, options: [...(form.accommodation.options || []), { type: "", description: "", price: "" }] })}>
                  <Plus className="w-3 h-3 mr-1" /> Add Option
                </Button>
              </div>
              {(form.accommodation.options || []).map((opt, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 items-end">
                  <FieldGroup label="Type">
                    <Input value={opt.type} onChange={(e) => {
                      const updated = [...form.accommodation.options];
                      updated[i] = { ...opt, type: e.target.value };
                      updateField("accommodation", { ...form.accommodation, options: updated });
                    }} placeholder="Single Occupancy" />
                  </FieldGroup>
                  <FieldGroup label="Description">
                    <Input value={opt.description} onChange={(e) => {
                      const updated = [...form.accommodation.options];
                      updated[i] = { ...opt, description: e.target.value };
                      updateField("accommodation", { ...form.accommodation, options: updated });
                    }} />
                  </FieldGroup>
                  <FieldGroup label="Price">
                    <Input value={opt.price} onChange={(e) => {
                      const updated = [...form.accommodation.options];
                      updated[i] = { ...opt, price: e.target.value };
                      updateField("accommodation", { ...form.accommodation, options: updated });
                    }} placeholder="£1,850" />
                  </FieldGroup>
                  <Button variant="ghost" size="sm" className="text-destructive mb-0.5" onClick={() => {
                    const updated = form.accommodation.options.filter((_, j) => j !== i);
                    updateField("accommodation", { ...form.accommodation, options: updated });
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Menu */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h3 className="font-medium text-foreground">Menu / Dining</h3>
              <FieldGroup label="Description">
                <Textarea value={form.menu.description} onChange={(e) => updateField("menu", { ...form.menu, description: e.target.value })} rows={3} />
              </FieldGroup>
              <ListEditor label="Menu Highlights" items={form.menu.highlights || []} onChange={(items) => updateField("menu", { ...form.menu, highlights: items })} />
            </div>

            <ListEditor label="What's Included" items={form.inclusions} onChange={(items) => updateField("inclusions", items)} />
            <ListEditor label="Not Included" items={form.not_included} onChange={(items) => updateField("not_included", items)} />
            <ListEditor label="Facilities" items={form.facilities} onChange={(items) => updateField("facilities", items)} />
            <ListEditor label="Categories" items={form.categories} onChange={(items) => updateField("categories", items)} />
            <ListEditor label="Tags" items={form.tags} onChange={(items) => updateField("tags", items)} />
          </TabsContent>

          {/* MEDIA TAB */}
          <TabsContent value="media" className="space-y-6">
            {/* Hero Image */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h3 className="font-medium text-foreground">Hero Image</h3>
              {form.hero_image_url ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img src={form.hero_image_url} alt={form.hero_image_alt || "Hero"} className="w-full h-48 object-cover rounded-lg" />
                    <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => { updateField("hero_image_url", ""); updateField("hero_image_alt", ""); }}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <FieldGroup label="Alt Text (SEO)">
                    <Input value={form.hero_image_alt} onChange={(e) => updateField("hero_image_alt", e.target.value)} placeholder="Describe this image for search engines and accessibility" />
                  </FieldGroup>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Click to upload hero image"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "hero")} disabled={uploading} />
                </label>
              )}
            </div>

            {/* Gallery */}
            <ImageGalleryEditor
              title="Gallery Images"
              urls={form.gallery_image_urls}
              alts={form.gallery_image_alts}
              onUrlsChange={(urls) => updateField("gallery_image_urls", urls)}
              onAltsChange={(alts) => updateField("gallery_image_alts", alts)}
              onUpload={(e) => handleImageUpload(e, "gallery")}
              uploading={uploading}
            />

            {/* Accommodation Images */}
            <ImageGalleryEditor
              title="Accommodation Images"
              urls={form.accommodation_image_urls}
              alts={form.accommodation_image_alts}
              onUrlsChange={(urls) => updateField("accommodation_image_urls", urls)}
              onAltsChange={(alts) => updateField("accommodation_image_alts", alts)}
              onUpload={(e) => handleImageUpload(e, "accommodation")}
              uploading={uploading}
            />

            {/* Dining Images */}
            <ImageGalleryEditor
              title="Dining Images"
              urls={form.dining_image_urls}
              alts={form.dining_image_alts}
              onUrlsChange={(urls) => updateField("dining_image_urls", urls)}
              onAltsChange={(alts) => updateField("dining_image_alts", alts)}
              onUpload={(e) => handleImageUpload(e, "dining")}
              uploading={uploading}
            />
          </TabsContent>

          {/* SCHEDULE TAB */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="border border-border rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Daily Schedule</h3>
                <Button variant="outline" size="sm" onClick={() => updateField("schedule", [...form.schedule, { time: "", activity: "" }])}>
                  <Plus className="w-3 h-3 mr-1" /> Add Entry
                </Button>
              </div>
              {form.schedule.map((entry, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 items-end">
                  <FieldGroup label="Time">
                    <Input value={entry.time} onChange={(e) => {
                      const updated = [...form.schedule];
                      updated[i] = { ...entry, time: e.target.value };
                      updateField("schedule", updated);
                    }} placeholder="08:00" />
                  </FieldGroup>
                  <div className="col-span-2">
                    <FieldGroup label="Activity">
                      <Input value={entry.activity} onChange={(e) => {
                        const updated = [...form.schedule];
                        updated[i] = { ...entry, activity: e.target.value };
                        updateField("schedule", updated);
                      }} placeholder="Morning mat Pilates" />
                    </FieldGroup>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive mb-0.5" onClick={() => updateField("schedule", form.schedule.filter((_, j) => j !== i))}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* SEO TAB */}
          <TabsContent value="seo" className="space-y-6">
            <FieldGroup label="SEO Title">
              <Input value={form.seo_title} onChange={(e) => updateField("seo_title", e.target.value)} placeholder="Leave blank to use retreat title" />
              <p className="text-xs text-muted-foreground mt-1">{(form.seo_title || form.title).length}/60 characters</p>
            </FieldGroup>
            <FieldGroup label="SEO Description">
              <Textarea value={form.seo_description} onChange={(e) => updateField("seo_description", e.target.value)} rows={3} placeholder="Leave blank to use retreat description" />
              <p className="text-xs text-muted-foreground mt-1">{(form.seo_description || form.description).length}/160 characters</p>
            </FieldGroup>
            <ListEditor label="SEO Keywords" items={form.seo_keywords} onChange={(items) => updateField("seo_keywords", items)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Reusable field group
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium text-foreground mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

// Reusable list editor (for arrays of strings)
function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem("");
  };

  return (
    <div className="border border-border rounded-lg p-5 space-y-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={item} onChange={(e) => {
              const updated = [...items];
              updated[i] = e.target.value;
              onChange(updated);
            }} className="flex-1" />
            <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder={`Add to ${label.toLowerCase()}...`} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())} className="flex-1" />
        <Button variant="outline" size="sm" onClick={addItem} disabled={!newItem.trim()}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// Reusable image gallery editor with alt text support
function ImageGalleryEditor({ title, urls, alts, onUrlsChange, onAltsChange, onUpload, uploading }: {
  title: string;
  urls: string[];
  alts: string[];
  onUrlsChange: (urls: string[]) => void;
  onAltsChange: (alts: string[]) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}) {
  const removeImage = (index: number) => {
    onUrlsChange(urls.filter((_, j) => j !== index));
    onAltsChange(alts.filter((_, j) => j !== index));
  };

  const updateAlt = (index: number, value: string) => {
    const updated = [...alts];
    while (updated.length <= index) updated.push("");
    updated[index] = value;
    onAltsChange(updated);
  };

  return (
    <div className="border border-border rounded-lg p-5 space-y-4">
      <h3 className="font-medium text-foreground">{title}</h3>
      <div className="space-y-4">
        {urls.map((url, i) => (
          <div key={i} className="flex gap-4 items-start bg-secondary/50 rounded-lg p-3">
            <div className="relative flex-shrink-0">
              <img src={url} alt={alts[i] || `${title} ${i + 1}`} className="w-32 h-24 object-cover rounded-lg" />
              <Button variant="destructive" size="sm" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={() => removeImage(i)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex-1">
              <FieldGroup label="Alt Text (SEO)">
                <Input
                  value={alts[i] || ""}
                  onChange={(e) => updateAlt(i, e.target.value)}
                  placeholder="Describe this image for search engines and accessibility"
                />
              </FieldGroup>
            </div>
          </div>
        ))}
      </div>
      <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
        <Plus className="w-6 h-6 text-muted-foreground mb-1" />
        <span className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Add image"}</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} disabled={uploading} />
      </label>
    </div>
  );
}
