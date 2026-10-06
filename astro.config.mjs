// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pratishtha-abrol.github.io',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
