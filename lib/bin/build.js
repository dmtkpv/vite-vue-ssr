#!/usr/bin/env node

console.log('Hey')

// import { resolve, dirname } from 'path'
// import { fileURLToPath } from 'url';
// import { resolveConfig, mergeConfig, build } from 'vite'
// import { getEntry } from '../ssr/common.js'
//
//
//
// // ---------------------
// // Vite SSR config
// // ---------------------
//
// function getServerConfig (config) {
//     return {
//         build: {
//             ssr: getEntry(config),
//             outDir: resolve(dirname(fileURLToPath(import.meta.url)), '.build'),
//             emptyOutDir: true,
//         }
//     }
// }
//
//
//
// // -------------------------
// // Create production server
// // -------------------------
//
// export default async function (inlineConfig) {
//     const config = await resolveConfig(inlineConfig, 'build', 'production');
//     const serverConfig = mergeConfig(inlineConfig, getServerConfig(config));
//     await build(inlineConfig);
//     await build(serverConfig);
// }
