import express from 'express';
import createSSR from '@dmtkpv/ssr/createSSR';
import isMobile from 'is-mobile'

(async () => {

    const port = 49049;
    const app = express();
    const ssr = await createSSR();

    app.use(ssr.middlewares);

    app.get('/*', (req, res, next) => {
        ssr.render(req.originalUrl, { isMobile: isMobile({ ua: req }) }).then(html => res.send(html)).catch(next)
    })

    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })

})();


