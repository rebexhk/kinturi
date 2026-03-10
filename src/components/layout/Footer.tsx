import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
const footerLinks = {
  explore: [{
    name: "All Retreats",
    href: "/retreats"
  }, {
    name: "Mat Pilates",
    href: "/retreats?type=mat"
  }, {
    name: "Reformer Pilates",
    href: "/retreats?type=reformer"
  }],
  company: [{
    name: "About Us",
    href: "/about"
  }, {
    name: "Blog",
    href: "/blog"
  }, {
    name: "Contact",
    href: "/contact"
  }],
  hosts: [{
    name: "List Your Retreat",
    href: "/list-retreat"
  }]
};
export function Footer() {
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
                  <Link to={link.href} className="text-small hover:text-foreground transition-colors">
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

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-small text-center">
            © {new Date().getFullYear()} Kinturi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}