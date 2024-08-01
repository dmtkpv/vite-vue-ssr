import express from 'express'
import { resolve, basename, dirname } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url';
import { resolveConfig, mergeConfig, build } from 'vite'
import { getEntry, getRenderedHTML } from './common.js'



// ---------------------
// Vite SSR config
// ---------------------

function getServerConfig (config) {
    return {
        build: {
            ssr: getEntry(config.root),
            outDir: resolve(dirname(fileURLToPath(import.meta.url)), '.build'),
            emptyOutDir: true,
        }
    }
}



// -------------------------
// Create production server
// -------------------------

export default async function createProdSSR (options) {

    const config = await resolveConfig({}, 'build', 'production');
    const serverConfig = getServerConfig(config);

    await build();
    await build(serverConfig);

    const dist = resolve(config.root, config.build.outDir);
    const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
    const entry = await import(resolve(serverConfig.build.outDir, basename(serverConfig.build.ssr)));

    function render (url, state) {
        return getRenderedHTML(url, template, entry, state);
    }

    return {
        render,
        middlewares: express.static(dist, { index: false })
    }

}
