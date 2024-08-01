import { resolve } from 'path'
import { readFileSync } from 'fs'
import { renderToString } from 'vue/server-renderer'
import { JSDOM } from 'jsdom'



// -------------------------------
// Get entry point from index.html
// -------------------------------

export function getEntry ({ root }) {
    const path = resolve(root, 'index.html');
    const template = readFileSync(path, 'utf8');
    const index = template.lastIndexOf('script type="module"');
    const matches = template.substr(index).match(/src="(.*)">/);
    return matches?.[1] || 'src/main'
}



// ---------------------
// Render
// ---------------------

export async function getRenderedHTML (url, template, entry, state) {

    const app = await entry.default(state);
    const { config, ssr } = app;
    const { data, selector } = ssr;
    const { globalProperties: { $router, $head } } = config;

    if ($router) {
        await $router.push(url);
    }

    const html = await renderToString(app);
    const dom = new JSDOM(template);
    const doc = dom.window.document;

    if ($head) {
        const { renderDOMHead } = await import('@unhead/dom');
        await renderDOMHead($head, { document: doc })
    }

    const script = doc.createElement('script');
    script.textContent = `window.__INITIAL_STATE__ = ${JSON.stringify(data)}`;
    doc.head.append(script);

    const root = doc.querySelector(selector);
    root.innerHTML = html + root.innerHTML

    return dom.serialize();

}
