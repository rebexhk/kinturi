import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { useCurrency, type Currency, CURRENCY_SYMBOLS } from "@/contexts/CurrencyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const footerLinks = {
  explore: [
    { name: "All Retreats", href: "/retreats" },
    { name: "Yoga Retreats", href: "/retreats?type=Yoga" },
    { name: "Pilates Retreats", href: "/retreats?type=Pilates" },
    { name: "Surf Retreats", href: "/retreats?type=Surf" },
    { name: "Hiking Retreats", href: "/retreats?type=Hiking" },
    { name: "Fitness Retreats", href: "/retreats?type=Fitness" },
    { name: "Adventure Retreats", href: "/retreats?type=Adventure" },
  ],
  company: [{
    name: "About Us",
    href: "/about"
  }, {
    name: "Blog",
    href: "/blog"
  }, {
    name: "Contact",
    href: "/contact"
  }, {
    name: "The Kinturi Edit Newsletter",
    href: "/#newsletter"
  }],
  hosts: [{
    name: "Contact",
    href: "/contact"
  }]
};
export function Footer() {
  const { currency, setCurrency } = useCurrency();
  return <footer className="bg-secondary border-t border-border">
      <div className="container-page py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-medium text-foreground">
                Kinturi
              </span>
            </Link>
            <p className="mt-4 text-small max-w-xs">Discover a curated selection of fitness-focused holidays and active escapes in beautiful destinations.</p>
            <div className="mt-4 flex items-center gap-3">
              {/* Instagram placeholder */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* Pinterest placeholder */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 12c0-2.8 1.8-5 4-5s4 2.2 4 5c0 2.2-1.8 4-4 4" />
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 22l1.5-6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-sans text-sm font-medium text-foreground tracking-wide uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map(link => <li key={link.name}>
                  <Link to={link.href} className="text-small hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-sm font-medium text-foreground tracking-wide uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={(e) => {
                      if (link.href === "/#newsletter" && window.location.pathname === "/") {
                        e.preventDefault();
                        document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-small hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* For Hosts */}
          <div>
            <h4 className="font-sans text-sm font-medium text-foreground tracking-wide uppercase mb-4">
              For Hosts
            </h4>
            <ul className="space-y-3">
              {footerLinks.hosts.map(link => <li key={link.name}>
                  <Link to={link.href} className="text-small hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-small">
            © {new Date().getFullYear()} Kinturi. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="currency-select" className="text-small">Currency</label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger id="currency-select" className="h-8 w-[110px] text-small">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["GBP", "EUR", "USD"] as Currency[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {CURRENCY_SYMBOLS[c]} {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Link to="/privacy-policy" className="text-small hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-small hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/admin-login" className="text-muted-foreground/40 hover:text-muted-foreground transition-colors" aria-label="Admin">
              <Settings className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>;
}