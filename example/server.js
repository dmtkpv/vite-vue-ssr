import express from 'express';
import createSSR from 'vite-vue-ssr/createSSR';
import isMobile from 'is-mobile'

(async () => {

    const port = 49049;
    const app = express();

    const ssr = await createSSR({
        mode: process.env.NODE_ENV,
        build: false
    });

    app.use(ssr.middlewares);

    app.get('/*', (req, res, next) => {
        ssr.render(req.originalUrl, { isMobile: isMobile({ ua: req }) }).then(html => res.send(html)).catch(next)
    })

    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })

})();


