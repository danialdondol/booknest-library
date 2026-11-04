import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const page = (name) => fileURLToPath(new URL(name, import.meta.url));
const partialRoot = fileURLToPath(new URL('src/partials/', import.meta.url));

/**
 * Tiny build-time include system. It keeps the shared header/footer in one
 * place without shipping a runtime template engine or duplicating markup.
 */
function htmlPartials() {
  return {
    name: 'booknest-html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/<!--\s*include:([a-z-]+)\s*-->/gi, (_match, name) =>
          readFileSync(`${partialRoot}${name}.html`, 'utf8').trimEnd(),
        );
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [htmlPartials()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        login: page('index.html'),
        dashboard: page('dashboard.html'),
        books: page('books.html'),
        members: page('members.html'),
        notFound: page('404.html'),
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
