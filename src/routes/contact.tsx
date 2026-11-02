import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Directions — The Zero, Dhaka" },
      {
        name: "description",
        content:
          "Visit The Zero at BAFWWA Shopping Complex, Dhaka 1212. Open daily, closes 11 PM. Call 01729-791000.",
      },
      { property: "og:title", content: "Contact — The Zero" },
      {
        property: "og:description",
        content: "Find us, call us, or stop by for dine-in and takeaway.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "The Zero",
          url: `${SITE_URL}/contact`,
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
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "10:00",
              closes: "23:00",
            },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <h1 className="text-6xl md:text-7xl">Visit us</h1>

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.3fr]">
        <div>
          <dl className="divide-y divide-slate/15 border-y border-slate/15">
            <Row label="Address">
              BAFWWA Shopping Complex, Bir Uttam Ziaur Rahman Rd, Dhaka 1212
            </Row>
            <Row label="Phone">
              <a href="tel:01729791000" className="text-velvet underline underline-offset-4">
                01729-791000
              </a>
            </Row>
            <Row label="Hours">Every day, 10 am to 11 pm</Row>
            <Row label="Dine in">
              Two floors of seating, a smoking zone, and room for families and groups.
            </Row>
            <Row label="Takeaway">Call ahead and your order will be packed when you arrive.</Row>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/reserve">Book a table</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:01729791000">Call us</a>
            </Button>
          </div>
        </div>

        <iframe
          title="The Zero on Google Maps"
          src="https://www.google.com/maps?q=The+Zero+Restaurant,+BAFWWA+Shopping+Complex,+Dhaka&output=embed"
          className="min-h-[420px] w-full rounded-md border border-slate/15"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 py-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
