import { createFileRoute } from "@tanstack/react-router";
import { menu } from "@/data/menu";
import { SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — The Zero Restaurant, Dhaka" },
      {
        name: "description",
        content:
          "Explore peri-peri grills, wood-fired pizzas, salads, sides, and desserts at The Zero.",
      },
      { property: "og:title", content: "Menu — The Zero" },
      {
        property: "og:description",
        content: "Peri-peri grills, wood-fired pizzas and house drinks.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/menu` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Menu",
          name: "The Zero Menu",
          url: `${SITE_URL}/menu`,
          hasMenuSection: [
            { "@type": "MenuSection", name: "Grills" },
            { "@type": "MenuSection", name: "Pizza" },
            { "@type": "MenuSection", name: "Starters & Sides" },
            { "@type": "MenuSection", name: "Cafe & Drinks" },
            { "@type": "MenuSection", name: "Desserts" },
          ],
        }),
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="text-6xl md:text-7xl">Menu</h1>
        <p className="mt-4 text-muted-foreground">
          Most guests spend ৳400 to ৳1,600 each. Prices include taxes.
        </p>
      </header>

      {/* Jump to a section */}
      <nav
        aria-label="Menu sections"
        className="sticky top-[72px] z-30 -mx-5 mt-10 overflow-x-auto border-y border-slate/15 bg-concrete/95 px-5 backdrop-blur"
      >
        <ul className="flex gap-6 whitespace-nowrap py-3 text-sm">
          {menu.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="text-muted-foreground hover:text-slate">
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* The menu card */}
      <div className="mt-10 rounded-md bg-plaster px-6 py-4 md:px-12 md:py-8">
        {menu.map((cat) => (
          <section
            key={cat.id}
            id={cat.id}
            className="scroll-mt-32 border-b border-slate/15 py-10 last:border-b-0"
          >
            <h2 className="text-3xl md:text-4xl">{cat.title}</h2>
            <ul className="mt-6 grid gap-x-14 gap-y-6 md:grid-cols-2">
              {cat.items.map((item) => (
                <li key={item.name}>
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-xl">{item.name}</h3>
                    <span className="flex-1 border-b border-dotted border-slate/30" />
                    <span className="font-semibold text-velvet">{item.price}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                    {item.popular && <span className="ml-2 text-oak">House favourite</span>}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
