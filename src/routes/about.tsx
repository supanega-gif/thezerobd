import { createFileRoute } from "@tanstack/react-router";
import { Heart, Users, Award, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import interior from "@/assets/interior.jpg";
import storefront from "@/assets/storefront.png";
import spread from "@/assets/spread.jpg";
import storefrontNight from "@/assets/storefront-night.jpg";
import interiorStairs from "@/assets/interior-stairs.jpg";
import interiorTeal from "@/assets/interior-teal.jpg";
import upload3 from "@/assets/upload-3.jpg";
import upload5 from "@/assets/upload-5.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — The Zero Restaurant, Dhaka" },
      { name: "description", content: "The story behind The Zero — a warm two-floor family restaurant in the BAFWWA Shopping Complex, Dhaka." },
      { property: "og:title", content: "About — The Zero" },
      { property: "og:description", content: "A warm two-floor family restaurant in Dhaka." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Heart, title: "Hospitality first", text: "Every guest is welcomed like family." },
  { icon: Sparkles, title: "Honest ingredients", text: "Fresh produce, real spices, no shortcuts." },
  { icon: Users, title: "A place to gather", text: "Designed for long evenings with friends and family." },
  { icon: Award, title: "Loved in Dhaka", text: "187+ reviews and a 4.3 average rating." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header className="max-w-3xl">
        <p className="animate-fade-up text-xs uppercase tracking-[0.4em] text-primary">Taste the Art</p>
        <h1 className="animate-fade-up mt-3 font-display text-5xl md:text-6xl" style={{ animationDelay: "150ms" }}>
          Good food. Warm people. <span className="text-gradient-gold">Always.</span>
        </h1>
      </header>

      <Reveal>
        <figure className="img-zoom mt-12 rounded-3xl border border-border shadow-warm">
          <img src={storefrontNight} alt="The Zero storefront in Dhaka, lit up at night" className="w-full object-cover" loading="lazy" />
        </figure>
      </Reveal>

      <div className="mt-16 grid items-start gap-12 md:grid-cols-2">
        <Reveal>
          <div className="img-zoom rounded-2xl shadow-warm">
            <img src={interiorStairs} alt="Inside The Zero — main dining room with feature staircase" width={1400} height={900} loading="lazy" className="rounded-2xl object-cover" />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>The Zero began with a simple idea — a neighbourhood restaurant where the food is bold, the welcome is warm, and the experience feels effortlessly right.</p>
            <p>Spread across two floors of the BAFWWA Shopping Complex on Bir Uttam Ziaur Rahman Road, our dining room blends comfortable sofa seating with classic dining tables, soft amber lighting and a dedicated smoking zone.</p>
            <p>From flame-grilled peri-peri chicken to molten lava cake, every plate is built around real ingredients and the kind of care that only a family-run kitchen can give.</p>
          </div>
        </Reveal>
      </div>

      <section className="mt-24">
        <Reveal><h2 className="font-display text-4xl">What we stand for</h2></Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="hover-lift h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/40">
                <div className="float-slow grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <Reveal><h2 className="font-display text-4xl">Step inside</h2></Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { src: interiorTeal, alt: "Teal velvet seating and indoor plants" },
            { src: upload3, alt: "Warm wooden tables and banquette seating" },
            { src: upload5, alt: "Two-floor dining with hanging lights" },
            { src: interior, alt: "Cosy corner of The Zero" },
            { src: spread, alt: "A spread of pizza, wings and drinks" },
            { src: storefront, alt: "The Zero storefront" },
          ].map((p, i) => (
            <Reveal key={p.alt} delay={i * 80}>
              <div className="img-zoom aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-warm">
                <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="mt-24 overflow-hidden rounded-3xl border border-border">
          <div className="grid md:grid-cols-2">
            <div className="img-zoom">
              <img src={spread} alt="A table spread at The Zero" width={1400} height={900} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="bg-card p-10 md:p-14">
              <h2 className="font-display text-3xl md:text-4xl">From the guestbook</h2>
              <blockquote className="mt-6 border-l-2 border-primary pl-5 text-lg italic text-muted-foreground">
                “Tasty food, generous portions and the best service. Totally satisfied.”
                <footer className="mt-3 text-sm not-italic text-foreground">— Recent guest</footer>
              </blockquote>
              <blockquote className="mt-6 border-l-2 border-primary pl-5 text-lg italic text-muted-foreground">
                “The second floor is well-decorated and visually appealing — sofas and chairs both, a great place to gather.”
                <footer className="mt-3 text-sm not-italic text-foreground">— Nahian I., Local Guide</footer>
              </blockquote>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
