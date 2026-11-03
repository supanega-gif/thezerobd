import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { BASE_PATH, SITE_URL } from "./src/lib/site-config.ts";

// The site is built as plain static HTML files (one per page) so it can be
// hosted on GitHub Pages, which has no server. See README "Deployment".
export default defineConfig({
  // Every asset URL starts with this, e.g. /thezerobd/assets/logo.png
  base: `${BASE_PATH}/`,
  // Lets code import from "@/..." meaning the src folder (set in tsconfig.json).
  resolve: { tsconfigPaths: true },
  server: { host: true, port: 8080 },
  // The 3D view is about 1 MB. That's expected: it only loads on the booking page.
  build: { chunkSizeWarningLimit: 1200 },
  plugins: [
    tailwindcss(),
    tanstackStart({
      router: { basepath: BASE_PATH || "/" },
      // Render every page to HTML at build time.
      prerender: { enabled: true, crawlLinks: false, failOnError: true },
      pages: ["/", "/menu", "/about", "/contact", "/reserve"].map((path) => ({ path })),
      sitemap: { enabled: true, host: SITE_URL },
    }),
    viteReact(),
  ],
});
