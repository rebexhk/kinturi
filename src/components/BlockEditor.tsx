import { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Quote, List, ListOrdered,
  Minus, Image as ImageIcon, Plus, Type, MousePointerClick,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CtaButtonDialog } from "./blog/CtaButtonDialog";

// Legacy block types for migration
export type BlockType = "heading1" | "heading2" | "heading3" | "paragraph" | "image" | "quote" | "list" | "divider";
export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  alt?: string;
  caption?: string;
  items?: string[];
}

// Convert legacy blocks to HTML for the editor
function blocksToHtml(blocks: ContentBlock[]): string {
  if (!blocks || blocks.length === 0) return "";
  return blocks.map((b) => {
    switch (b.type) {
      case "heading1": return `<h1>${b.content}</h1>`;
      case "heading2": return `<h2>${b.content}</h2>`;
      case "heading3": return `<h3>${b.content}</h3>`;
      case "paragraph": return `<p>${b.content}</p>`;
      case "image": return `<img src="${b.content}" alt="${b.alt || ""}" title="${b.caption || ""}" />`;
      case "quote": return `<blockquote><p>${b.content}</p></blockquote>`;
      case "list": return `<ul>${(b.items || []).map((i) => `<li>${i}</li>`).join("")}</ul>`;
      case "divider": return `<hr />`;
      default: return `<p>${b.content}</p>`;
    }
  }).join("");
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}

function ToolbarButton({ onClick, active, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

interface FloatingAddButtonProps {
  editor: Editor;
}

function FloatingAddButton({ editor }: FloatingAddButtonProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      if (!editor) return;
      const { state } = editor;
      const { $from } = state.selection;
      // Show button only on empty paragraphs
      const isEmptyBlock =
        $from.parent.content.size === 0 &&
        $from.parent.type.name === "paragraph";

      if (isEmptyBlock) {
        const coords = editor.view.coordsAtPos(state.selection.from);
        const editorRect = editor.view.dom.getBoundingClientRect();
        setPosition({
          top: coords.top - editorRect.top - 2,
          left: -40,
        });
      } else {
        setPosition(null);
        setOpen(false);
      }
    };

    editor.on("selectionUpdate", updatePosition);
    editor.on("update", updatePosition);
    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("update", updatePosition);
    };
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
      editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      setOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const ctaDialog = (
    <CtaButtonDialog
      open={ctaOpen}
      onOpenChange={setCtaOpen}
      onInsert={(label, url) => {
        const safeLabel = label.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeUrl = url.replace(/"/g, "&quot;");
        const html = `<p><a class="blog-cta-button" href="${safeUrl}">${safeLabel}</a></p><p></p>`;
        editor.chain().focus().insertContent(html).run();
        setOpen(false);
      }}
    />
  );

  if (!position) {
    return ctaDialog;
  }

  return (
    <>
      {ctaDialog}
      <div
        ref={menuRef}
        className="absolute z-10"
        style={{ top: position.top, left: position.left }}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "w-7 h-7 rounded-full border border-border flex items-center justify-center transition-all",
            open
              ? "bg-primary text-primary-foreground rotate-45 border-primary"
              : "bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40"
          )}
        >
          <Plus className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute left-9 top-0 bg-card border border-border rounded-lg shadow-lg py-1 flex gap-0.5 px-1 animate-in fade-in-0 zoom-in-95">
            <ToolbarButton
              title="CTA button"
              onClick={() => {
                setCtaOpen(true);
                setOpen(false);
              }}
            >
              <MousePointerClick className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Image"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Divider"
              onClick={() => {
                editor.chain().focus().setHorizontalRule().run();
                setOpen(false);
              }}
            >
              <Minus className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Blockquote"
              onClick={() => {
                editor.chain().focus().toggleBlockquote().run();
                setOpen(false);
              }}
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Bullet List"
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
                setOpen(false);
              }}
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Numbered List"
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
                setOpen(false);
              }}
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>
    </>
  );
}

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  // New HTML-based API
  value?: string;
  onChangeHtml?: (html: string) => void;
}

export default function BlockEditor({ blocks, onChange, value, onChangeHtml }: BlockEditorProps) {
  const initialContent = value || blocksToHtml(blocks) || "";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full mx-auto my-4",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing… Press Enter for a new line, or click + to add images & more",
      }),
      Underline,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-stone max-w-none min-h-[300px] outline-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChangeHtml) {
        onChangeHtml(html);
      }
      // Still update blocks for backward compat (stored as content field)
      onChange([]); // Signal change; actual data is HTML now
    },
  });

  if (!editor) return null;

  return (
    <div className="relative">
      {/* Floating toolbar that appears on text selection */}
      <BubbleMenu
        editor={editor}
        className="bg-card border border-border rounded-lg shadow-lg py-1 px-1 flex items-center gap-0.5"
      >
        {/* Text type / heading toggles */}
        <ToolbarButton
          title="Paragraph"
          active={editor.isActive("paragraph") && !editor.isActive("heading")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Type className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Inline formatting */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Block-level from bubble */}
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
      </BubbleMenu>

      {/* + button on empty lines */}
      <FloatingAddButton editor={editor} />

      {/* The actual editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
