import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ success: false, message: "invalid_email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if email exists
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (!existing) {
      return new Response(JSON.stringify({ success: false, message: "not_found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete the subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", existing.id);

    if (error) throw error;

    const normalizedEmail = email.trim().toLowerCase();

    // Send confirmation email BEFORE adding to suppression list
    // (suppression check would otherwise block the send).
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "unsubscribe-confirmation",
          recipientEmail: normalizedEmail,
          idempotencyKey: `unsub-confirm-${existing.id}`,
        },
      });
    } catch (sendErr) {
      console.error("Failed to send unsubscribe confirmation", sendErr);
    }

    // Add to global suppression list so future transactional emails are blocked
    await supabase
      .from("suppressed_emails")
      .insert({ email: normalizedEmail, reason: "user_unsubscribe" });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: "server_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
