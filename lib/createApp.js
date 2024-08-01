import { createSSRApp } from 'vue'

export default function createApp (component, callback) {

    const isSSR = typeof window === 'undefined';

    async function setup (data = {}) {
        const app = createSSRApp(component);
        app.ssr = {};
        app.ssr.data = data;
        app.ssr.nativeMount = app.mount;
        app.mount = selector => app.ssr.selector = selector;
        await callback(app, data);
        return app;
    }

    async function mount () {
        const app = await setup(window.__INITIAL_STATE__);
        const { config, ssr } = app;
        const { nativeMount, selector } = ssr;
        const { globalProperties: { $router } } = config;
        if ($router) await $router.isReady();
        nativeMount(selector);
    }

    return isSSR ? setup : mount();

}