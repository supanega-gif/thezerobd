import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Clock, MapPin, Utensils, Flame, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import hero from "@/assets/hero.jpg";
import interior from "@/assets/interior.jpg";
import spread from "@/assets/spread.jpg";
import { menu } from "@/data/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Zero — Family Restaurant in Dhaka" },
      { name: "description", content: "Grilled chicken, wood-fired pizza and warm hospitality at The Zero, BAFWWA Shopping Complex, Dhaka." },
      { property: "og:title", content: "The Zero — Family Restaurant in Dhaka" },
      { property: "og:description", content: "Grilled favourites, wood-fired pizza and warm hospitality." },
    ],
  }),
  component: Home,
});

const highlights = [
  { icon: Flame, title: "Wood-Fired Grills", text: "Peri-peri, jerk and lemon-herb chicken kissed by open flame." },
  { icon: Utensils, title: "Family Dining", text: "Roomy seating across two floors, perfect for family gatherings." },
  { icon: Coffee, title: "Cafe & Desserts", text: "Lattes, mochas and our famous molten lava cake." },
];

const popular = menu.flatMap((c) => c.items.filter((i) => i.popular)).slice(0, 6);

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="Signature peri-peri grilled chicken at The Zero"
          width={1600}
          height={1100}
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-32 sm:px-6 md:pb-28 md:pt-40">
          <p className="animate-fade-up mb-5 inline-flex items-center gap-3 self-start rounded-full border border-primary/40 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.4em] text-primary shadow-warm backdrop-blur" style={{ animationDelay: "100ms" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Taste the Art <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </p>
          <h1 className="animate-fade-up max-w-3xl font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl" style={{ animationDelay: "250ms" }}>
            Where flavour <span className="text-gradient-gold">meets warmth.</span>
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-lg text-muted-foreground" style={{ animationDelay: "400ms" }}>
            Grilled favourites, wood-fired pizza and hand-crafted drinks — served by a team that treats every guest like family.
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "550ms" }}>
            <Button asChild size="lg" className="shimmer bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-warm">
              <Link to="/menu">Explore the Menu</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-background/40 backdrop-blur transition-transform hover:-translate-y-0.5">
              <Link to="/contact">Find Us</Link>
            </Button>
          </div>

          <div className="animate-fade-up mt-12 grid max-w-2xl gap-6 sm:grid-cols-3" style={{ animationDelay: "700ms" }}>
            <Stat icon={Star} label="4.3 / 5 · 187 reviews" />
            <Stat icon={Clock} label="Open daily · Closes 11 PM" />
            <Stat icon={MapPin} label="BAFWWA, Dhaka 1212" />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal className="mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">What we do</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A taste of every craving</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 120}>
              <div className="hover-lift group h-full rounded-2xl border border-border bg-card p-8 hover:border-primary/40">
                <div className="float-slow grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold text-primary-foreground transition-transform group-hover:scale-110">
                  <h.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SIGNATURE STORY */}
      <section className="bg-card/40 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2">
          <Reveal>
            <div className="img-zoom rounded-2xl shadow-warm">
              <img
                src={interior}
                alt="The Zero restaurant warm interior"
                width={1400}
                height={900}
                loading="lazy"
                className="rounded-2xl object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Our story</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">A warm corner of Dhaka.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Tucked inside the BAFWWA Shopping Complex beside BAF Shaheen College, The Zero spreads across two floors of cosy seating, soft amber lights and the comfortable buzz of friends gathered over a good meal.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Whether you are stopping in for a quick grilled platter or settling in for a long evening with family, our team is here to make it memorable.
            </p>
            <Button asChild className="mt-8 bg-gradient-gold text-primary-foreground hover:opacity-90 transition-transform hover:-translate-y-0.5">
              <Link to="/about">Read more</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* POPULAR */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Loved by guests</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Most popular</h2>
          </div>
          <Button asChild variant="outline" className="transition-transform hover:-translate-y-0.5">
            <Link to="/menu">View full menu</Link>
          </Button>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {popular.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <div className="hover-lift h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/40">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl">{item.name}</h3>
                  <span className="font-display text-lg text-primary">{item.price}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden">
        <img src={spread} alt="A spread of pizza, wings, fries and drinks" width={1400} height={900} loading="lazy" className="ken-burns absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl">Reserve your table <span className="text-gradient-gold">tonight</span></h2>
            <p className="mt-4 text-muted-foreground">Dine-in and takeaway available. Call us to plan your visit.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="shimmer bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-warm">
                <a href="tel:01729791000">Call 01729-791000</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="transition-transform hover:-translate-y-0.5">
                <Link to="/contact">Get directions</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Stat({ icon: Icon, label }: { icon: typeof Star; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 backdrop-blur">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
