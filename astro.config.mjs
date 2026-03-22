import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    fallback: { pt: 'en' },
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
      langs: ['python', 'bash', 'json', 'javascript', 'typescript'],
      wrap: false,
    },
  },
  vite: {
    server: {
      allowedHosts: ['subtarsal-kohen-unfinanced.ngrok-free.dev', '.ngrok-free.dev']
    }
  }
});
