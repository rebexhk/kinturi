import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Please provide a search query (at least 3 characters)." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: retreats, error: dbError } = await supabase
      .from("retreats")
      .select("id, title, slug, location, country, type, description, facilities, inclusions, not_included, menu, accommodation, duration, price, group_size, level, hero_image_url, tags, kinturi_take")
      .eq("status", "published");

    if (dbError) throw dbError;
    if (!retreats || retreats.length === 0) {
      return new Response(JSON.stringify({ topMatches: [], alternatives: [], message: "No retreats are currently available." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const retreatSummaries = retreats.map((r: any) => ({
      slug: r.slug,
      title: r.title,
      location: r.location,
      country: r.country,
      type: r.type,
      duration: r.duration,
      price: r.price,
      level: r.level,
      group_size: r.group_size,
      description: r.description?.substring(0, 300),
      facilities: r.facilities,
      inclusions: r.inclusions,
      not_included: r.not_included,
      menu: typeof r.menu === "object" ? JSON.stringify(r.menu)?.substring(0, 200) : "",
      accommodation: typeof r.accommodation === "object" ? JSON.stringify(r.accommodation)?.substring(0, 200) : "",
      tags: r.tags,
      kinturi_take: r.kinturi_take,
    }));

    const systemPrompt = `You are Kinturi's retreat matching assistant. Given a customer's natural language query and a list of retreats, analyze which retreats best match their preferences. Consider activity types, location/climate preferences, food preferences, accommodation style, budget hints, duration, and any other factors mentioned.

Use the rank_retreats function to return your results.`;

    const userPrompt = `Customer query: "${query}"

Available retreats:
${JSON.stringify(retreatSummaries, null, 1)}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "rank_retreats",
              description: "Return ranked retreat matches for the customer query",
              parameters: {
                type: "object",
                properties: {
                  topMatches: {
                    type: "array",
                    description: "Best 1-3 matching retreats, ordered by relevance",
                    items: {
                      type: "object",
                      properties: {
                        slug: { type: "string", description: "Retreat slug identifier" },
                        reason: { type: "string", description: "2-3 sentence explanation of why this retreat matches the customer's request" },
                        score: { type: "number", description: "Relevance score from 0 to 100" },
                      },
                      required: ["slug", "reason", "score"],
                      additionalProperties: false,
                    },
                  },
                  alternatives: {
                    type: "array",
                    description: "Other retreats worth considering, 0-3 items",
                    items: {
                      type: "object",
                      properties: {
                        slug: { type: "string", description: "Retreat slug identifier" },
                        reason: { type: "string", description: "Brief reason this could also work" },
                        score: { type: "number", description: "Relevance score from 0 to 100" },
                      },
                      required: ["slug", "reason", "score"],
                      additionalProperties: false,
                    },
                  },
                  summary: {
                    type: "string",
                    description: "A friendly 1-2 sentence summary of the search results for the customer",
                  },
                },
                required: ["topMatches", "alternatives", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "rank_retreats" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Our AI assistant is busy right now. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("No tool call in AI response");

    const ranked = JSON.parse(toolCall.function.arguments);

    // Enrich with retreat data
    const retreatMap = new Map(retreats.map((r: any) => [r.slug, r]));
    const enrich = (items: any[]) =>
      items
        .filter((item: any) => retreatMap.has(item.slug))
        .map((item: any) => {
          const r = retreatMap.get(item.slug)!;
          return {
            ...item,
            title: (r as any).title,
            location: (r as any).location,
            country: (r as any).country,
            type: (r as any).type,
            duration: (r as any).duration,
            price: (r as any).price,
            hero_image_url: (r as any).hero_image_url,
          };
        });

    const result = {
      topMatches: enrich(ranked.topMatches || []),
      alternatives: enrich(ranked.alternatives || []),
      summary: ranked.summary || "",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-retreat-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
