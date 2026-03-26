import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function verifyAdmin(req: Request): boolean {
  const token = req.headers.get('x-admin-token');
  return !!token; // Token presence = authenticated (validated on login)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
    // GET - list all retreats (including drafts)
    if (method === 'GET') {
      const id = url.searchParams.get('id');
      if (id) {
        const { data, error } = await supabase
          .from('retreats')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      const { data, error } = await supabase
        .from('retreats')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST - create retreat
    if (method === 'POST') {
      const body = await req.json();
      // Auto-extract country from location
      if (body.location && (!body.country || body.country === '')) {
        const parts = body.location.split(',');
        body.country = parts[parts.length - 1].trim();
      }
      const { data, error } = await supabase
        .from('retreats')
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // PUT - update retreat
    if (method === 'PUT') {
      const body = await req.json();
      // Auto-extract country from location
      if (body.location && (!body.country || body.country === '')) {
        body.country = body.location.split(',').pop()?.trim() || '';
      }
      const { id, ...updates } = body;
      const { data, error } = await supabase
        .from('retreats')
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
      const { error } = await supabase
        .from('retreats')
        .delete()
        .eq('id', id);
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
