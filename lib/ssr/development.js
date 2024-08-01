import { resolve } from 'path'
import { readFileSync } from 'fs'
import { createServer, mergeConfig } from 'vite'
import { getEntry, getRenderedHTML } from './common.js'



// ---------------------
// Vite Dev config
// ---------------------

const devConfig = {
    server: { middlewareMode: true },
    appType: 'custom'
}



// ----------------------
// Create dev server
// ----------------------

export default async function createDevSSR (inlineConfig) {

    const config = mergeConfig(inlineConfig, devConfig);
    const vite = await createServer(config);

    function getTemplate (url) {
        const path = resolve(vite.config.root, 'index.html');
        const content = readFileSync(path, 'utf8');
        return vite.transformIndexHtml(url, content);
    }

    function loadEntry () {
        const entry = getEntry(vite.config);
        return vite.ssrLoadModule(entry);
    }

    async function render (url, state) {
        try {
            const template = await getTemplate(url);
            const entry = await loadEntry();
            return getRenderedHTML(url, template, entry, state);
        }
        catch (error) {
            vite.ssrFixStacktrace(error);
            throw error;
        }
    }

    return {
        render,
        middlewares: vite.middlewares
    }

}
