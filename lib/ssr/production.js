import express from 'express'
import { resolve, basename } from 'path'
import { readFileSync } from 'fs'
import { resolveConfig, build } from 'vite'
import { getEntry, getRenderedHTML } from './common.js'



// ---------------------
// Vite SSR config
// ---------------------

function getServerConfig (config) {
    return {
        build: {
            ssr: getEntry(config.root),
            outDir: resolve(config.root, config.build.outDir, '.server'),
            emptyOutDir: true,
        }
    }
}



// ---------------------
// Get Configs
// ---------------------

export async function setup (options = {}) {

    const config = await resolveConfig({}, 'build', 'production');
    const serverConfig = getServerConfig(config);

    if (options.build !== false) {
        await build();
        await build(serverConfig);
    }

    return {
        config,
        serverConfig
    }

}



// -------------------------
// Create production server
// -------------------------

export default async function createProdSSR (options) {

    const { config, serverConfig } = await setup(options);
    const dist = resolve(config.root, config.build.outDir);
    const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
    const entry = await import(resolve(serverConfig.build.outDir, basename(serverConfig.build.ssr)));

    function render (url, state) {
        return getRenderedHTML(url, template, entry, state);
    }

    return {
        render,
        middlewares: express.static(dist, {
            index: false,
            dotfiles: 'ignore'
        })
    }

}
