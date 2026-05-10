import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { menu } from "@/data/menu";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — The Zero Restaurant, Dhaka" },
      { name: "description", content: "Explore peri-peri grills, wood-fired pizzas, salads, sides, and desserts at The Zero." },
      { property: "og:title", content: "Menu — The Zero" },
      { property: "og:description", content: "Peri-peri grills, wood-fired pizzas and house drinks." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header className="text-center">
        <p className="animate-fade-up text-sm uppercase tracking-[0.3em] text-primary">Our menu</p>
        <h1 className="animate-fade-up mt-3 font-display text-5xl md:text-6xl" style={{ animationDelay: "120ms" }}>
          From our kitchen, <span className="text-gradient-gold">with care.</span>
        </h1>
        <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-muted-foreground" style={{ animationDelay: "240ms" }}>
          Approximate price range ৳400–1,600 per person. Prices include taxes.
        </p>
      </header>

      {/* category nav */}
      <nav className="sticky top-16 z-30 mt-12 -mx-4 flex justify-center border-y border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {menu.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="nav-underline text-muted-foreground transition-colors hover:text-primary">
              {c.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-16 space-y-20">
        {menu.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-32">
            <Reveal className="mb-8 flex items-center gap-4">
              <h2 className="font-display text-3xl md:text-4xl">{cat.title}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            </Reveal>
            <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
              {cat.items.map((item, i) => (
                <Reveal key={item.name} delay={(i % 6) * 70}>
                  <article className="group rounded-xl p-2 transition-colors hover:bg-card/60">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display text-xl transition-colors group-hover:text-primary">
                        {item.name}
                        {item.popular && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wider text-accent">
                            <Star className="h-2.5 w-2.5 fill-current" />Popular
                          </span>
                        )}
                      </h3>
                      <div className="flex-1 border-b border-dashed border-border/60" />
                      <span className="font-display text-lg text-primary">{item.price}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
