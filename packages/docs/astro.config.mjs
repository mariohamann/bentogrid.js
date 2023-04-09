import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), markdoc()],
  site: "https://mariohamann.github.io/",
  base: "/bentogrid.js/"
});