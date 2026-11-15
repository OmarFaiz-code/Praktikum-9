import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

// Halaman utama (auth, error) ada di resources/js/pages,
// sedangkan halaman tiap modul ada di Modules/{Modul}/resources/js/pages.
const corePages = import.meta.glob('./pages/**/*.tsx', { eager: true });
const modulePages = import.meta.glob('../../Modules/*/resources/js/pages/**/*.tsx', { eager: true });

/**
 * Nama halaman:
 *  - 'auth/login'      -> resources/js/pages/auth/login.tsx
 *  - 'Buku::index'     -> Modules/Buku/resources/js/pages/index.tsx
 */
function resolvePage(name: string) {
    const key = name.includes('::')
        ? (() => {
              const [module, page] = name.split('::');
              return `../../Modules/${module}/resources/js/pages/${page}.tsx`;
          })()
        : `./pages/${name}.tsx`;

    const page = (name.includes('::') ? modulePages : corePages)[key];

    if (!page) {
        throw new Error(`Halaman Inertia tidak ditemukan: ${name} (${key})`);
    }

    return page;
}

createInertiaApp({
    title: (title) => (title ? `${title} - SiPustaka` : 'SiPustaka'),
    resolve: resolvePage,
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: { color: '#4f46e5' },
});
