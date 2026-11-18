import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://LycorisWired.github.io',
  base: '/personal-website',
  markdown: { shikiConfig: { theme: 'tokyo-night' } },
});
