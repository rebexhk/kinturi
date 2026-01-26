import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Retreats", href: "/retreats" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "List Your Retreat", href: "/list-retreat" },
  { name: "Contact", href: "/contact" },
];

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        transparent ? "bg-transparent" : "bg-background/95 backdrop-blur-sm border-b border-border"
      )}
    >
      <nav className="container-page flex items-center justify-between py-4 lg:py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span
            className={cn(
              "font-serif text-2xl lg:text-3xl font-medium tracking-tight",
              transparent ? "text-primary-foreground" : "text-foreground"
            )}
          >
            Kinturi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm tracking-wide transition-colors duration-200",
                transparent
                  ? "text-primary-foreground/90 hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
                location.pathname === item.href && (transparent ? "text-primary-foreground" : "text-foreground")
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className={cn("h-6 w-6", transparent ? "text-primary-foreground" : "text-foreground")} />
          ) : (
            <Menu className={cn("h-6 w-6", transparent ? "text-primary-foreground" : "text-foreground")} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="container-page py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block py-2 text-sm tracking-wide transition-colors",
                  "text-muted-foreground hover:text-foreground",
                  location.pathname === item.href && "text-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
