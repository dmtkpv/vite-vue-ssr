import { h, inject } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { createHead, useHead } from '@vueuse/head'
import axios from 'axios'
import createApp from '@dmtkpv/ssr/createApp'
import createRouter from '@dmtkpv/ssr/createRouter'



// ---------------------
// Components
// ---------------------

const Root = {
    setup () {
        return () => [
            h('h1', 'SSR'),
            h(RouterLink, { to: '/' }, () => h('button', 'Home')),
            h(RouterLink, { to: '/fact' }, () => h('button', 'Fact')),
            h(RouterView)
        ]
    }
}

const Home = {
    setup () {
        useHead({ title: 'Home' });
        return () => h('section', 'Home page');
    }
}

const Fact = {
    setup () {
        useHead({ title: 'Fact' });
        const { fact } = inject('state');
        return () => h('section', fact);
    }
}



// ---------------------
// Routes
// ---------------------

function createRoutes (state) {
    return [
        {
            path: '/',
            component: Home
        },
        {
            path: '/fact',
            component: Fact,
            async beforeEnter () {
                state.fact ??= await fetch();
            }
        }
    ]
}



// ---------------------
// Fetch data
// ---------------------

function fetch () {
    return axios.get('https://catfact.ninja/fact').then(response => {
        return response.data.fact;
    })
}



// ---------------------
// Create App
// ---------------------

export default createApp(Root, (app, state) => {

    console.log(state);

    const head = createHead();
    const routes = createRoutes(state);
    const router = createRouter({ routes });

    app.provide('state', state);
    app.use(head);
    app.use(router);
    app.mount('body');

})