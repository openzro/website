import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://openzro.io",
  integrations: [tailwind({ applyBaseStyles: true })],

  build: {
    inlineStylesheets: "auto",
  },

  adapter: cloudflare()
});