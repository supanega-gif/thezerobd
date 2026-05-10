import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Directions — The Zero, Dhaka" },
      { name: "description", content: "Visit The Zero at BAFWWA Shopping Complex, Dhaka 1212. Open daily, closes 11 PM. Call 01729-791000." },
      { property: "og:title", content: "Contact — The Zero" },
      { property: "og:description", content: "Find us, call us, or stop by for dine-in and takeaway." },
    ],
  }),
  component: ContactPage,
});

const hours = [
  ["Monday", "11:00 AM – 11:00 PM"],
  ["Tuesday", "11:00 AM – 11:00 PM"],
  ["Wednesday", "11:00 AM – 11:00 PM"],
  ["Thursday", "11:00 AM – 11:00 PM"],
  ["Friday", "11:00 AM – 11:00 PM"],
  ["Saturday", "11:00 AM – 11:00 PM"],
  ["Sunday", "11:00 AM – 11:00 PM"],
];

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Visit us</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Come say hello.</h1>
        <p className="mt-5 text-muted-foreground">
          Dine-in and takeaway available. Call ahead for groups or bookings.
        </p>
      </header>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <InfoCard icon={MapPin} title="Address" lines={["BAFWWA Shopping Complex", "Bir Uttam Ziaur Rahman Rd", "Dhaka 1212"]} />
        <InfoCard icon={Phone} title="Phone" lines={[<a key="p" href="tel:01729791000" className="text-foreground hover:text-primary">01729-791000</a>]} />
        <InfoCard icon={Clock} title="Hours" lines={["Open daily", "11:00 AM – 11:00 PM"]} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground"><UtensilsCrossed className="h-5 w-5" /></div>
          <h3 className="mt-4 font-display text-2xl">Dine-In</h3>
          <p className="mt-2 text-sm text-muted-foreground">Two floors of cosy seating with a dedicated smoking zone. Great for families and groups.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground"><ShoppingBag className="h-5 w-5" /></div>
          <h3 className="mt-4 font-display text-2xl">Takeaway</h3>
          <p className="mt-2 text-sm text-muted-foreground">Call ahead and your order will be packed and ready when you arrive.</p>
        </div>
      </div>

      <section className="mt-12 grid gap-10 md:grid-cols-[1fr,1.3fr]">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-display text-2xl">Opening hours</h3>
          <ul className="mt-5 divide-y divide-border/60">
            {hours.map(([d, t]) => (
              <li key={d} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">{d}</span>
                <span className="text-foreground">{t}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
            <a href="tel:01729791000"><Phone className="mr-2 h-4 w-4" />Call to reserve</a>
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe
            title="The Zero on Google Maps"
            src="https://www.google.com/maps?q=BAFWWA+Shopping+Complex+Dhaka&output=embed"
            className="h-full min-h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, title, lines }: { icon: typeof MapPin; title: string; lines: React.ReactNode[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground"><Icon className="h-5 w-5" /></div>
      <h3 className="mt-4 font-display text-xl">{title}</h3>
      <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
