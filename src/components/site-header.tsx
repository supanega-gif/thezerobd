import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={logo}
            alt="The Zero"
            className="h-14 w-auto transition-transform duration-500 group-hover:scale-105 sm:h-16"
          />
          <span className="hidden text-[10px] uppercase tracking-[0.32em] text-primary sm:inline">
            Taste the Art
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="nav-underline text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              activeProps={
                { className: "text-foreground font-medium", "data-status": "active" } as never
              }
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            asChild
            variant="default"
            className="shimmer bg-gradient-gold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:opacity-95"
          >
            <a href="tel:01729791000">
              <Phone className="mr-2 h-4 w-4" />
              Reserve
            </a>
          </Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-muted-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <a
              href="tel:01729791000"
              className="mt-2 inline-flex items-center justify-center rounded-md bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call to Reserve
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
