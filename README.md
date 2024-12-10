# vite-vue-ssr
Server Side Rendering for Vite + Vue.  
Compatible with [`vue-router`](https://github.com/vuejs/router) and [`@unhead/vue`](https://github.com/unjs/unhead/tree/main/packages/vue).

## Installation
```shell
npm i vite-vue-ssr
```

## Usage

Create `server.js`
```js
import express from 'express';
import createSSR from 'vite-vue-ssr/createSSR';

(async () => {

    const port = 8080;
    const app = express();
    const ssr = await createSSR({
        mode: 'production' // or development
    });

    app.use(ssr.middlewares);

    app.get('/*', (req, res, next) => {
        ssr.render(req.originalUrl).then(html => res.send(html)).catch(next)
    })

    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })

})();
```

Create entry point, e.g. `index.js`
```js
import createApp from 'vite-vue-ssr/createApp'

export default createApp(App, app => {
    app.mount('body');
})
```

Create `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<body>
    <script type="module" src="/index.js"></script>
</body>
</html>
```

Run the server
```shell
node server.js
```

## Examples


### Initial state
The initial state is the application data that is serialized as part of the server-rendered HTML for later hydration in the browser. This data is normally gathered using fetch or DB requests from your API code.

The initial state is a plain JS object that is passed to your application and can be modified at will during SSR. This object will be serialized and later hydrated automatically in the browser, and passed to your app again so you can use it as a data source.
```js
import createApp from 'vite-vue-ssr/createApp'

export default createApp(App, (app, state) => {
    if (import.meta.env.SSR) state.foo = 'bar'
    else console.log(state.foo) // => 'bar'
    app.mount('body');
})
```


### With vue-router
```js
import createApp from 'vite-vue-ssr/createApp'
import createRouter from 'vite-vue-ssr/createRouter'

export default createApp(App, app => {
    const router = createRouter({ routes });
    app.use(router);
    app.mount('body');
})
```


### Prebuild

Manually build the project
```sh
npx vite-vue-ssr
```

Then skip the server build
```js
import createSSR from 'vite-vue-ssr/createSSR';

const ssr = await createSSR({
    build: false
});
```







