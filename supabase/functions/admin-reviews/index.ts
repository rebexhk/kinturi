import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function verifyAdmin(req: Request): boolean {
  const token = req.headers.get('x-admin-token');
  return !!token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!verifyAdmin(req)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const url = new URL(req.url);
  const method = req.method;

  try {
    // GET - list all reviews (optionally filter by retreat_id)
    if (method === 'GET') {
      const retreatId = url.searchParams.get('retreat_id');
      let query = supabase.from('reviews').select('*, retreats(title)').order('created_at', { ascending: false });
      if (retreatId) {
        query = query.eq('retreat_id', retreatId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST - create a review
    if (method === 'POST') {
      const body = await req.json();
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          retreat_id: body.retreat_id,
          reviewer_name: body.reviewer_name,
          rating: body.rating,
          comment: body.comment,
          status: body.status || 'approved',
        })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // PUT - update review (admin reply, status change)
    if (method === 'PUT') {
      const body = await req.json();
      const { id, ...updates } = body;
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // DELETE
    if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) throw new Error('Missing id');
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
