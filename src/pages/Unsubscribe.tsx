import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setLoading(true);

    const { data, error } = await supabase.functions.invoke("admin-newsletter-unsubscribe", {
      body: { email: trimmed },
    });

    setLoading(false);

    if (error || !data?.success) {
      if (data?.message === "not_found") {
        toast.info("This email address is not in our mailing list.");
      } else {
        toast.error("Something went wrong. Please try again or contact us directly.");
      }
      return;
    }

    setSuccess(true);
  };

  return (
    <Layout>
      <div className="container-page py-16 lg:py-24 max-w-lg mx-auto text-center">
        {success ? (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-primary mx-auto" />
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">You've been unsubscribed</h1>
            <p className="text-muted-foreground text-sm">
              Your email has been removed from our mailing list. We're sorry to see you go!
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-3">Unsubscribe from Newsletter</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Enter your email address below and we'll remove you from our mailing list.
            </p>
            <form onSubmit={handleUnsubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" disabled={loading} className="shrink-0">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unsubscribe"}
              </Button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}
