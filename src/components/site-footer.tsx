import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="The Zero" className="h-14 w-auto" />
          <p className="mt-2 text-xs uppercase tracking-[0.4em] text-primary">Taste the Art</p>
          <p className="mt-5 max-w-md text-sm text-muted-foreground">
            A warm family restaurant in Dhaka serving grilled favourites, wood-fired pizza, and
            hand-crafted drinks since day one.
          </p>
        </div>

        <div>
          <h4 className="font-display text-base text-foreground">Visit</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              BAFWWA Shopping Complex, Bir Uttam Ziaur Rahman Rd, Dhaka 1212
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:01729791000" className="hover:text-foreground">
                01729-791000
              </a>
            </li>
            <li className="flex gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Open daily · 10 AM – 11 PM
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base text-foreground">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/menu" className="hover:text-foreground">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} The Zero Restaurant · Dhaka
      </div>
    </footer>
  );
}
