import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmed });

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast.info("You're already subscribed!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return;
    }

    toast.success("You're in! Thanks for subscribing.");
    setEmail("");
  };

  return (
    <section className="section-padding bg-primary shadow-none">
      <div className="container-page text-center max-w-xl mx-auto">
        <h2 className="font-serif text-2xl text-primary-foreground mb-3 font-normal shadow-none md:text-2xl">
          Sign up for The Kinturi Edit
        </h2>
        <p className="text-primary-foreground/80 text-sm mb-8">
          The best active escapes, straight to your inbox. Be the first to hear about new retreats, exclusive offers, and travel inspiration.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/40"
          />
          <Button
            type="submit"
            disabled={loading}
            className="shrink-0 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
