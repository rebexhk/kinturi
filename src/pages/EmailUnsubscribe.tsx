import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function EmailUnsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<"validating" | "ready" | "already" | "invalid" | "submitting" | "done" | "error">("validating");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } }
        );
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.valid) setState("ready");
        else if (data.alreadyUsed || data.already_used) setState("already");
        else setState("invalid");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error || !data?.success) {
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <Layout>
      <div className="container-page py-16 lg:py-24 max-w-lg mx-auto text-center">
        {state === "validating" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Checking your link…</p>
          </div>
        )}

        {state === "ready" && (
          <>
            <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              Unsubscribe from Kinturi emails
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              Confirm below and we'll stop sending you emails. You'll receive a final email confirming this change.
            </p>
            <Button onClick={handleConfirm}>Confirm unsubscribe</Button>
          </>
        )}

        {state === "submitting" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Unsubscribing…</p>
          </div>
        )}

        {state === "done" && (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-primary mx-auto" />
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">You've been unsubscribed</h1>
            <p className="text-muted-foreground text-sm">
              You won't receive further emails from Kinturi. A confirmation has been sent to your inbox.
            </p>
          </div>
        )}

        {state === "already" && (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-primary mx-auto" />
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">Already unsubscribed</h1>
            <p className="text-muted-foreground text-sm">
              This email address has already been removed from our list.
            </p>
          </div>
        )}

        {(state === "invalid" || state === "error") && (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">
              {state === "invalid" ? "Link is invalid or expired" : "Something went wrong"}
            </h1>
            <p className="text-muted-foreground text-sm">
              You can also unsubscribe directly{" "}
              <a href="/unsubscribe" className="underline">on this page</a>.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
