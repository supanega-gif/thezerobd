import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "Our story" },
  { to: "/contact", label: "Visit" },
] as const;

// Slate bar like the restaurant's night facade, so the gold logo reads clearly.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-slate text-plaster">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        <Link to="/" onClick={close} aria-label="The Zero, home">
          <img src={logo} alt="The Zero" className="h-[68px] w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-plaster/75 hover:text-plaster"
              activeProps={{
                className: "text-plaster underline decoration-brass underline-offset-8",
              }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/reserve"
            className="rounded-full bg-plaster px-5 py-2 text-sm font-semibold text-slate hover:bg-white"
          >
            Book a table
          </Link>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-plaster/15 px-5 pb-6 md:hidden" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={close}
              className="block border-b border-plaster/10 py-3 font-display text-2xl"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/reserve"
            onClick={close}
            className="mt-5 block rounded-full bg-plaster py-3 text-center font-semibold text-slate"
          >
            Book a table
          </Link>
        </nav>
      )}
    </header>
  );
}
