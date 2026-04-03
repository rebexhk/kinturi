import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function verifyAdmin(req: Request): boolean {
  return !!req.headers.get('x-admin-token');
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

// Convert pipe-separated string to array
function toArray(val: string): string[] {
  if (!val) return [];
  return val.split('|').map(s => s.trim()).filter(Boolean);
}

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildRetreat(row: Record<string, string>) {
  const title = row.title || '';
  const location = row.location || '';
  const parts = location.split(',');
  const country = row.country || parts[parts.length - 1]?.trim() || '';

  return {
    title,
    slug: row.slug || toSlug(title),
    status: row.status || 'draft',
    location,
    country,
    address: row.address || null,
    duration: row.duration || '',
    type: toArray(row.type),
    description: row.description || '',
    price: row.price || '',
    group_size: row.group_size || null,
    level: row.level || null,
    featured: row.featured === 'true',
    hero_image_url: row.hero_image_url || null,
    hero_image_alt: row.hero_image_alt || null,
    gallery_image_urls: toArray(row.gallery_image_urls),
    gallery_image_alts: toArray(row.gallery_image_alts),
    accommodation_image_urls: toArray(row.accommodation_image_urls),
    accommodation_image_alts: toArray(row.accommodation_image_alts),
    dining_image_urls: toArray(row.dining_image_urls),
    dining_image_alts: toArray(row.dining_image_alts),
    inclusions: toArray(row.inclusions),
    not_included: toArray(row.not_included),
    facilities: toArray(row.facilities),
    tags: toArray(row.tags),
    seo_title: row.seo_title || null,
    seo_description: row.seo_description || null,
    seo_keywords: toArray(row.seo_keywords),
    // JSON fields - parse if provided, otherwise default
    schedule: row.schedule ? JSON.parse(row.schedule) : [],
    dates: row.dates ? JSON.parse(row.dates) : [],
    instructor: row.instructor ? JSON.parse(row.instructor) : {},
    menu: row.menu ? JSON.parse(row.menu) : {},
    accommodation: row.accommodation ? JSON.parse(row.accommodation) : {},
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!verifyAdmin(req)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const body = await req.json();
    const csvText = body.csv;
    if (!csvText) throw new Error('Missing csv field');

    const rows = parseCSV(csvText);
    if (rows.length === 0) throw new Error('No data rows found in CSV');

    const retreats = rows.map(buildRetreat);
    const errors: string[] = [];
    let inserted = 0;

    for (let i = 0; i < retreats.length; i++) {
      const r = retreats[i];
      if (!r.title || !r.location || !r.duration || !r.description || !r.price) {
        errors.push(`Row ${i + 2}: Missing required field (title, location, duration, description, or price)`);
        continue;
      }
      const { error } = await supabase.from('retreats').insert(r);
      if (error) {
        errors.push(`Row ${i + 2} "${r.title}": ${error.message}`);
      } else {
        inserted++;
      }
    }

    return new Response(JSON.stringify({ inserted, total: rows.length, errors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
