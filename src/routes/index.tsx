import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import storefrontNight from "@/assets/storefront-night.jpg";
import hero from "@/assets/hero.jpg";
import interiorStairs from "@/assets/interior-stairs.jpg";
import interiorTeal from "@/assets/interior-teal.jpg";
import { menu } from "@/data/menu";
import { tables } from "@/data/tables";
import { SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Zero — Family Restaurant in Dhaka" },
      {
        name: "description",
        content:
          "Grilled chicken, wood-fired pizza and warm hospitality at The Zero, BAFWWA Shopping Complex, Dhaka.",
      },
      { property: "og:title", content: "The Zero — Family Restaurant in Dhaka" },
      {
        property: "og:description",
        content: "Grilled favourites, wood-fired pizza and warm hospitality.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "The Zero",
          description:
            "Family restaurant in Dhaka serving wood-fired grills, pizza and cafe favourites.",
          url: `${SITE_URL}/`,
          telephone: "+880-1729-791000",
          servesCuisine: ["Grill", "Pizza", "Cafe"],
          priceRange: "৳৳",
          address: {
            "@type": "PostalAddress",
            streetAddress: "BAFWWA Shopping Complex, Bir Uttam Ziaur Rahman Rd",
            addressLocality: "Dhaka",
            postalCode: "1212",
            addressCountry: "BD",
          },
          openingHours: "Mo-Su 10:00-23:00",
        }),
      },
    ],
  }),
  component: Home,
});

const popular = menu.flatMap((c) => c.items.filter((i) => i.popular)).slice(0, 5);

function Home() {
  return (
    <>
      {/* Hero: "the lights come on". Animation styles are in styles.css, under Motion. */}
      <section className="mx-auto grid max-w-6xl items-end gap-12 px-5 pb-20 pt-14 md:grid-cols-[1.15fr_1fr] md:pt-20">
        <div className="hero-text md:pb-10">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl">Taste the art.</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Peri-peri off the grill, wood-fired pizza and good coffee, served across two floors on
            Bir Uttam Ziaur Rahman Road.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/reserve">Book a table</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/menu">See the menu</Link>
            </Button>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-2 gap-6 border-t border-slate/20 pt-6 text-sm">
            <div>
              <dt className="text-muted-foreground">Open daily</dt>
              <dd className="mt-1 font-semibold">10 am to 11 pm</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">On Google</dt>
              <dd className="mt-1 font-semibold">4.2 from 231 reviews</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          {/* Brass outline, slightly offset behind the photo. It draws itself on load. */}
          <svg
            aria-hidden
            viewBox="0 0 300 400"
            preserveAspectRatio="none"
            className="hero-outline absolute inset-0 h-full w-full translate-x-3 -translate-y-3 overflow-visible"
          >
            <path
              d="M1 400 V150 A149 149 0 0 1 299 150 V400"
              fill="none"
              stroke="var(--color-brass)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray={1}
            />
          </svg>
          <div className="arch hero-photo relative aspect-[3/4] bg-slate">
            <img
              src={storefrontNight}
              alt="The Zero at night, its entrance framed by a lit arch"
              fetchPriority="high"
              className="h-full w-full object-cover object-[50%_60%]"
            />
            <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
          </div>
        </div>
      </section>

      {/* Favourites */}
      <section className="bg-plaster">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1fr_1.2fr]">
          <div className="arch photo-zoom mx-auto aspect-[4/5] w-full max-w-sm">
            <img
              src={hero}
              alt="Peri-peri grilled chicken"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl">What most people order</h2>
            <ul className="mt-8">
              {popular.map((item) => (
                <li key={item.name} className="border-b border-slate/15 py-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-xl">{item.name}</span>
                    <span className="flex-1 border-b border-dotted border-slate/30" />
                    <span className="font-semibold text-velvet">{item.price}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/menu"
              className="mt-6 inline-block font-semibold text-velvet underline underline-offset-4"
            >
              See the full menu
            </Link>
          </div>
        </div>
      </section>

      {/* The rooms, leading into the 3D booking */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl">Choose your seat before you arrive</h2>
          <p className="mt-4 text-muted-foreground">
            Walk through both floors in 3D, see the view from any of our {tables.length} tables, and
            book the one you like.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <figure>
            <div className="photo-zoom rounded-md">
              <img
                src={interiorStairs}
                alt="Dining room with the brass arch and staircase"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted-foreground">
              The brass arch and the stairs to the first floor
            </figcaption>
          </figure>
          <figure className="md:mt-24">
            <div className="photo-zoom rounded-md">
              <img
                src={interiorTeal}
                alt="Teal velvet chairs, oak tables and plants"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted-foreground">
              Teal velvet, oak and greenery
            </figcaption>
          </figure>
        </div>
        <Button asChild size="lg" className="mt-10">
          <Link to="/reserve">Book a table in 3D</Link>
        </Button>
      </section>

      {/* A guest's words */}
      <section className="slats bg-slate text-plaster">
        <figure className="mx-auto max-w-3xl px-5 py-24">
          <blockquote className="font-display text-3xl leading-snug md:text-4xl">
            “Tasty food, generous portions and the best service. Totally satisfied.”
          </blockquote>
          <figcaption className="mt-6 text-sm text-plaster/70">A recent guest on Google</figcaption>
        </figure>
      </section>
    </>
  );
}
