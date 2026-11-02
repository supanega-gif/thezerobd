import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { SITE_ORIGIN } from "@/lib/site-config";
import hero from "@/assets/hero.jpg";

function NotFoundComponent() {
  return (
    <Message
      title="We couldn't find that page"
      text="It may have moved. Head back home or see the menu."
    >
      <Button asChild>
        <Link to="/">Go home</Link>
      </Button>
    </Message>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return (
    <Message title="This page didn't load" text="Refresh to try again, or head back home.">
      <Button
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Try again
      </Button>
      <Button asChild variant="outline">
        <Link to="/">Go home</Link>
      </Button>
    </Message>
  );
}

function Message(props: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-32">
      <h1 className="text-5xl">{props.title}</h1>
      <p className="mt-4 text-muted-foreground">{props.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">{props.children}</div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#263134" },
      { title: "The Zero — Family Restaurant in Dhaka" },
      {
        name: "description",
        content:
          "Grilled favourites, wood-fired pizza and warm hospitality at The Zero, BAFWWA Shopping Complex, Dhaka.",
      },
      { name: "author", content: "The Zero" },
      { property: "og:title", content: "The Zero — Family Restaurant in Dhaka" },
      {
        property: "og:description",
        content:
          "Grilled favourites, wood-fired pizza and warm hospitality at The Zero, BAFWWA Shopping Complex, Dhaka.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Zero — Family Restaurant in Dhaka" },
      {
        name: "twitter:description",
        content:
          "Grilled favourites, wood-fired pizza and warm hospitality at The Zero, BAFWWA Shopping Complex, Dhaka.",
      },
      // Imported image URLs already include BASE_PATH, so only the origin is added.
      { property: "og:image", content: `${SITE_ORIGIN}${hero}` },
      { name: "twitter:image", content: `${SITE_ORIGIN}${hero}` },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Gloock&family=Hanken+Grotesk:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
