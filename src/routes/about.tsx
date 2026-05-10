import { createFileRoute } from "@tanstack/react-router";
import { Heart, Users, Award, Sparkles } from "lucide-react";
import interior from "@/assets/interior.jpg";
import spread from "@/assets/spread.jpg";

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
        <p className="text-sm uppercase tracking-[0.3em] text-primary">About us</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Good food. Warm people. <span className="text-gradient-gold">Always.</span></h1>
      </header>

      <div className="mt-16 grid items-start gap-12 md:grid-cols-2">
        <img src={interior} alt="Inside The Zero" width={1400} height={900} loading="lazy" className="rounded-2xl object-cover shadow-warm" />
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>The Zero began with a simple idea — a neighbourhood restaurant where the food is bold, the welcome is warm, and the experience feels effortlessly right.</p>
          <p>Spread across two floors of the BAFWWA Shopping Complex on Bir Uttam Ziaur Rahman Road, our dining room blends comfortable sofa seating with classic dining tables, soft amber lighting and a dedicated smoking zone.</p>
          <p>From flame-grilled peri-peri chicken to molten lava cake, every plate is built around real ingredients and the kind of care that only a family-run kitchen can give.</p>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="font-display text-4xl">What we stand for</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-primary-foreground">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 overflow-hidden rounded-3xl border border-border">
        <div className="grid md:grid-cols-2">
          <img src={spread} alt="A table spread at The Zero" width={1400} height={900} loading="lazy" className="h-full w-full object-cover" />
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
    </div>
  );
}
