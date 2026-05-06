# Add proper CTAs to blog posts

Right now blog content is just rich text — any "View this retreat" is a plain hyperlink. To make CTAs feel like actual buttons/cards, we'll add **two** complementary tools so you have flexibility per post.

## 1. Inline CTA button (in the editor)

A new toolbar action in the blog editor: **"Insert CTA button"**.

- Opens a small dialogue: **Button label** + **Link URL** (with a quick "Link to a retreat" picker that searches your retreats and inserts the correct `/retreats/{slug}` URL).
- Inserts a styled button block into the article body — terracotta accent, rounded, centred, with arrow icon. Matches site button style.
- Renders identically on the live blog post.
- Use case: drop a "View this retreat →" button mid-article, or a "Browse all yoga retreats" CTA after a section.

Technically: a custom TipTap node that serialises to a semantic `<a class="blog-cta-button" href="…">…</a>`, styled via `src/index.css` so it survives `dangerouslySetInnerHTML` rendering on the public post.

## 2. "Related retreats" picker (per post)

A new section in the blog editor sidebar: **Related retreats**.

- Multi-select from your existing retreats (search + add, max 3).
- Stored as a `related_retreat_ids` array on the `blog_posts` row.
- Auto-renders at the **bottom of the published post** as a "Continue exploring" block: small retreat cards (image, name, location, "View retreat →" button), styled to match the rest of the site.
- Zero effort per post once selected — no need to write the CTA copy.

## Where things change

```text
DB        → blog_posts: + related_retreat_ids uuid[] (nullable)
Editor    → AdminBlogEditor.tsx: new "Related retreats" picker
Editor    → BlockEditor.tsx: new CTA-button toolbar action + node
Public    → BlogPost.tsx: render related-retreats card grid below article
Styles    → index.css: .blog-cta-button styling (terracotta, rounded)
```

## Notes

- All copy in British English (memory rule).
- CTA buttons use the existing terracotta accent; cards use sage hover state — consistent with the rest of the site.
- Old posts keep working unchanged; both features are optional per post.

## What I'll need from you after build

Nothing immediately — once it's live, open any post in the admin, try the **Insert CTA button** toolbar option, and pick 1–3 related retreats from the new sidebar section. I can also retro-fit one existing post as a demo if you tell me which.
