// Public sitemap.xml generator. Pulls published retreats + blog posts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://kinturi.lovable.app";

const STATIC_ROUTES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/retreats", changefreq: "daily", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/list-retreat", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms-conditions", changefreq: "yearly", priority: "0.2" },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod?: string, changefreq?: string, priority?: string): string {
  const parts = [`    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) parts.push(`    <priority>${priority}</priority>`);
  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const [retreatsRes, blogRes] = await Promise.all([
      supabase.from("retreats").select("slug, updated_at").eq("status", "published"),
      supabase.from("blog_posts").select("slug, updated_at").eq("status", "published"),
    ]);

    const today = new Date().toISOString().slice(0, 10);

    const entries: string[] = [];

    for (const r of STATIC_ROUTES) {
      entries.push(urlEntry(`${SITE_URL}${r.path}`, today, r.changefreq, r.priority));
    }

    for (const row of retreatsRes.data ?? []) {
      const lastmod = row.updated_at
        ? new Date(row.updated_at as string).toISOString().slice(0, 10)
        : today;
      entries.push(urlEntry(`${SITE_URL}/retreats/${row.slug}`, lastmod, "weekly", "0.8"));
    }

    for (const row of blogRes.data ?? []) {
      const lastmod = row.updated_at
        ? new Date(row.updated_at as string).toISOString().slice(0, 10)
        : today;
      entries.push(urlEntry(`${SITE_URL}/blog/${row.slug}`, lastmod, "monthly", "0.6"));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("sitemap error", err);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
      status: 500,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
});
