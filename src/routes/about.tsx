import { createFileRoute } from "@tanstack/react-router";
import interior from "@/assets/interior.jpg";
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
      {
        name: "description",
        content:
          "The story behind The Zero — a warm two-floor family restaurant in the BAFWWA Shopping Complex, Dhaka.",
      },
      { property: "og:title", content: "About — The Zero" },
      { property: "og:description", content: "A warm two-floor family restaurant in Dhaka." },
    ],
  }),
  component: AboutPage,
});

const photos = [
  { src: interiorTeal, alt: "Teal velvet chairs and indoor plants" },
  { src: upload3, alt: "Oak tables and banquette seating" },
  { src: upload5, alt: "Two floors of dining under hanging lights" },
  { src: interior, alt: "A quiet corner of the dining room" },
  { src: spread, alt: "Pizza, wings, fries and drinks on one table" },
];

function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-end gap-12 px-5 py-16 md:grid-cols-[1fr_1fr] md:py-20">
        <div>
          <h1 className="text-6xl md:text-7xl">Our story</h1>
          <div className="mt-8 max-w-lg space-y-5 text-lg text-muted-foreground">
            <p>
              The Zero started with a simple idea: a neighbourhood restaurant where the food is
              bold, the welcome is warm, and an evening never feels rushed.
            </p>
            <p>
              We take up two floors of the BAFWWA Shopping Complex on Bir Uttam Ziaur Rahman Road.
              Downstairs, a brass arch leads to the stairs. Upstairs, teal velvet chairs, sofas and
              plenty of greenery, with a separate smoking zone.
            </p>
            <p>
              From flame-grilled peri-peri chicken to molten lava cake, everything is cooked to
              order by a kitchen that treats guests like family.
            </p>
          </div>
        </div>
        <div className="arch photo-zoom mx-auto aspect-[3/4] w-full max-w-md">
          <img
            src={interiorStairs}
            alt="The brass arch and staircase inside The Zero"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-plaster">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-4xl md:text-5xl">Inside The Zero</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="photo-zoom col-span-2 row-span-2 rounded-md">
              <img
                src={storefrontNight}
                alt="The Zero's storefront lit up at night"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            {photos.map((p) => (
              <div key={p.alt} className="photo-zoom rounded-md">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="text-4xl md:text-5xl">What guests say</h2>
        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <figure className="border-l-2 border-brass pl-6">
            <blockquote className="font-display text-2xl leading-snug">
              “Tasty food, generous portions and the best service. Totally satisfied.”
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">A recent guest</figcaption>
          </figure>
          <figure className="border-l-2 border-brass pl-6">
            <blockquote className="font-display text-2xl leading-snug">
              “The second floor is well decorated and visually appealing, with sofas and chairs
              both. A great place to gather.”
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              Nahian I., Google Local Guide
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
