import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

// Standalone Vite config (previously wrapped by @lovable.dev/vite-tanstack-config,
// which only made sense inside Lovable's own editor/sandbox). This does the same
// core setup, minus the Lovable-editor-only pieces (component tagging, HMR bridge,
// sandbox port/host detection), so the project builds and runs anywhere.
export default defineConfig(({ command, mode }) => {
  // Expose VITE_-prefixed env vars as import.meta.env.* at build time.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    define: envDefine,
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: {
      host: true,
      port: 8080,
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        prerender: {
        enabled: true,
        crawlLinks: true,
      },
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
      }),
      viteReact(),
      // Only needed for the Cloudflare Workers deploy target; harmless to
      // leave in if you end up on Vercel or elsewhere, since it's build-only.
      ...(command === "build" ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
    ],
  };
});
