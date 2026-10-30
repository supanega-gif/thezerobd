import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { BASE_PATH, SITE_URL } from "./src/lib/site-config";

// The site is built as plain static HTML files (one per page) so it can be
// hosted on GitHub Pages, which has no server. See README "Deployment".
export default defineConfig({
  // Every asset URL starts with this, e.g. /thezerobd/assets/logo.png
  base: `${BASE_PATH}/`,
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
  },
  server: { host: true, port: 8080 },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
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
