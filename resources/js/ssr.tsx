import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'Okojie Online';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) =>
            title
                ? title.includes('Okojie')
                    ? title
                    : `${title} | ${appName}`
                : 'Okojie & Associates, Inc. — Okojie Online Tax Preparation',
        resolve: (name) => {
            const pages = import.meta.glob<{
                default: React.ComponentType<any>;
            }>('./pages/**/*.tsx', {
                eager: true,
            });
            return pages[`./pages/${name}.tsx`];
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
);
