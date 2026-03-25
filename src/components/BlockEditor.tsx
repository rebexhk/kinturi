import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus, Trash2, GripVertical, Upload, X,
  Type, Heading1, Heading2, Heading3, Image, Quote, List, Minus, AlignLeft
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export type BlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "image"
  | "quote"
  | "list"
  | "divider";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  alt?: string;       // for images
  caption?: string;   // for images
  items?: string[];   // for lists
}

function generateId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: "heading1", label: "Heading 1", icon: <Heading1 className="w-4 h-4" />, description: "Large section heading" },
  { type: "heading2", label: "Heading 2", icon: <Heading2 className="w-4 h-4" />, description: "Medium section heading" },
  { type: "heading3", label: "Heading 3", icon: <Heading3 className="w-4 h-4" />, description: "Small section heading" },
  { type: "paragraph", label: "Paragraph", icon: <AlignLeft className="w-4 h-4" />, description: "Body text" },
  { type: "image", label: "Image", icon: <Image className="w-4 h-4" />, description: "Upload a photo" },
  { type: "quote", label: "Quote", icon: <Quote className="w-4 h-4" />, description: "Blockquote" },
  { type: "list", label: "Bullet List", icon: <List className="w-4 h-4" />, description: "Unordered list" },
  { type: "divider", label: "Divider", icon: <Minus className="w-4 h-4" />, description: "Horizontal rule" },
];

function newBlock(type: BlockType): ContentBlock {
  return {
    id: generateId(),
    type,
    content: "",
    alt: "",
    caption: "",
    items: type === "list" ? [""] : undefined,
  };
}

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageIndex, setPendingImageIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const insertBlock = (type: BlockType, afterIndex: number) => {
    const next = [...blocks];
    const block = newBlock(type);
    next.splice(afterIndex + 1, 0, block);
    onChange(next);

    if (type === "image") {
      setPendingImageIndex(afterIndex + 1);
      setTimeout(() => fileInputRef.current?.click(), 100);
    }
  };

  const moveBlock = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || pendingImageIndex === null) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("retreat-images").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("retreat-images").getPublicUrl(path);
      updateBlock(pendingImageIndex, { content: urlData.publicUrl });
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      setPendingImageIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReupload = (index: number) => {
    setPendingImageIndex(index);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const AddBlockButton = ({ afterIndex }: { afterIndex: number }) => (
    <div className="flex justify-center py-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-6 h-6 rounded-full border border-dashed border-muted-foreground/40 group-hover:border-foreground/60 flex items-center justify-center transition-colors">
              <Plus className="w-3 h-3" />
            </div>
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">Add block</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Add Content Block</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {BLOCK_TYPES.map((bt) => (
            <DropdownMenuItem
              key={bt.type}
              onClick={() => insertBlock(bt.type, afterIndex)}
              className="flex items-center gap-3 cursor-pointer"
            >
              {bt.icon}
              <div>
                <div className="text-sm font-medium">{bt.label}</div>
                <div className="text-xs text-muted-foreground">{bt.description}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const renderBlock = (block: ContentBlock, index: number) => {
    const common = (
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-0.5 text-muted-foreground hover:text-foreground cursor-grab"
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragEnd={() => setDragIndex(null)}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>
    );

    const deleteBtn = (
      <button
        className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={() => removeBlock(index)}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    );

    switch (block.type) {
      case "heading1":
        return (
          <input
            className="w-full bg-transparent border-none outline-none font-serif text-3xl font-semibold text-foreground placeholder:text-muted-foreground/50"
            value={block.content}
            onChange={(e) => updateBlock(index, { content: e.target.value })}
            placeholder="Heading 1"
          />
        );
      case "heading2":
        return (
          <input
            className="w-full bg-transparent border-none outline-none font-serif text-2xl font-medium text-foreground placeholder:text-muted-foreground/50"
            value={block.content}
            onChange={(e) => updateBlock(index, { content: e.target.value })}
            placeholder="Heading 2"
          />
        );
      case "heading3":
        return (
          <input
            className="w-full bg-transparent border-none outline-none font-serif text-xl font-medium text-foreground placeholder:text-muted-foreground/50"
            value={block.content}
            onChange={(e) => updateBlock(index, { content: e.target.value })}
            placeholder="Heading 3"
          />
        );
      case "paragraph":
        return (
          <textarea
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 resize-none leading-relaxed min-h-[60px]"
            value={block.content}
            onChange={(e) => updateBlock(index, { content: e.target.value })}
            placeholder="Start writing..."
            rows={3}
          />
        );
      case "image":
        return (
          <div className="space-y-2">
            {block.content ? (
              <div className="relative">
                <img src={block.content} alt={block.alt || ""} className="w-full rounded-lg object-cover max-h-96" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    className="bg-background/80 rounded-full p-1.5 hover:bg-muted text-foreground"
                    onClick={() => handleReupload(index)}
                  >
                    <Upload className="w-3 h-3" />
                  </button>
                  <button
                    className="bg-background/80 rounded-full p-1.5 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => updateBlock(index, { content: "" })}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full py-12 border-2 border-dashed border-border rounded-lg flex flex-col items-center gap-2 text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
                onClick={() => handleReupload(index)}
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm">{uploading ? "Uploading..." : "Click to upload image"}</span>
              </button>
            )}
            <Input
              value={block.alt || ""}
              onChange={(e) => updateBlock(index, { alt: e.target.value })}
              placeholder="Alt text (for SEO & accessibility)"
              className="text-sm"
            />
            <Input
              value={block.caption || ""}
              onChange={(e) => updateBlock(index, { caption: e.target.value })}
              placeholder="Caption (optional)"
              className="text-sm"
            />
          </div>
        );
      case "quote":
        return (
          <div className="border-l-4 border-primary pl-4">
            <textarea
              className="w-full bg-transparent border-none outline-none italic text-foreground placeholder:text-muted-foreground/50 resize-none min-h-[40px]"
              value={block.content}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
              placeholder="Write a quote..."
              rows={2}
            />
          </div>
        );
      case "list":
        return (
          <div className="space-y-1">
            {(block.items || []).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-muted-foreground">•</span>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
                  value={item}
                  onChange={(e) => {
                    const items = [...(block.items || [])];
                    items[i] = e.target.value;
                    updateBlock(index, { items });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const items = [...(block.items || [])];
                      items.splice(i + 1, 0, "");
                      updateBlock(index, { items });
                    }
                    if (e.key === "Backspace" && item === "" && (block.items || []).length > 1) {
                      e.preventDefault();
                      const items = (block.items || []).filter((_, j) => j !== i);
                      updateBlock(index, { items });
                    }
                  }}
                  placeholder="List item"
                />
                {(block.items || []).length > 1 && (
                  <button
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => updateBlock(index, { items: (block.items || []).filter((_, j) => j !== i) })}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              className="text-xs text-muted-foreground hover:text-foreground ml-4"
              onClick={() => updateBlock(index, { items: [...(block.items || []), ""] })}
            >
              + Add item
            </button>
          </div>
        );
      case "divider":
        return <hr className="border-border my-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-0">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      {/* Initial add button if empty */}
      {blocks.length === 0 && <AddBlockButton afterIndex={-1} />}

      {blocks.map((block, index) => (
        <div key={block.id}>
          <div
            className="group relative pl-8 pr-8 py-2"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("bg-muted/50");
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove("bg-muted/50")}
            onDrop={(e) => {
              e.currentTarget.classList.remove("bg-muted/50");
              if (dragIndex !== null && dragIndex !== index) {
                moveBlock(dragIndex, index);
              }
            }}
          >
            {/* Drag handle */}
            <div className="absolute left-0 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-0.5 text-muted-foreground hover:text-foreground cursor-grab"
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragEnd={() => setDragIndex(null)}
              >
                <GripVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Delete button */}
            <button
              className="absolute right-0 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => removeBlock(index)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {renderBlock(block, index)}
          </div>

          <AddBlockButton afterIndex={index} />
        </div>
      ))}
    </div>
  );
}
