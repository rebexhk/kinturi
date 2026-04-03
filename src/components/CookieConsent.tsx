import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="container-page max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-lg p-5 md:p-6">
          <p className="text-sm text-muted-foreground mb-4">
            We use essential cookies to make our site work. We'd also like to set optional cookies to help us
            improve your experience and understand how you use our site. You can read more in our{" "}
            <Link to="/privacy-policy" className="underline text-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleAccept} size="sm" className="shrink-0">
              Accept all cookies
            </Button>
            <Button onClick={handleDecline} variant="outline" size="sm" className="shrink-0">
              Essential only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
