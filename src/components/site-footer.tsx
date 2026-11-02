import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="slats bg-slate text-plaster/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl text-plaster">The Zero</p>
          <p className="mt-3 max-w-sm text-sm">
            A two-floor family restaurant in the BAFWWA Shopping Complex, Dhaka. Grills, pizza and
            coffee, every day.
          </p>
        </div>

        <address className="text-sm not-italic">
          <p className="font-semibold text-plaster">Find us</p>
          <p className="mt-2">
            BAFWWA Shopping Complex
            <br />
            Bir Uttam Ziaur Rahman Rd
            <br />
            Dhaka 1212
          </p>
          <p className="mt-3">
            <a href="tel:01729791000" className="hover:text-plaster">
              01729-791000
            </a>
          </p>
          <p className="mt-1">Open daily, 10 am to 11 pm</p>
        </address>

        <nav className="text-sm" aria-label="Footer">
          <p className="font-semibold text-plaster">Pages</p>
          <ul className="mt-2 space-y-1.5">
            <li>
              <Link to="/menu" className="hover:text-plaster">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-plaster">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-plaster">
                Visit
              </Link>
            </li>
            <li>
              <Link to="/reserve" className="hover:text-plaster">
                Book a table
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-plaster/10 py-5 text-center text-xs text-plaster/60">
        © {new Date().getFullYear()} The Zero Restaurant, Dhaka
      </p>
    </footer>
  );
}
