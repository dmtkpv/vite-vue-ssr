import production from './ssr/production.js'
import development from './ssr/development.js'

export default function createSSR (inlineConfig = {}) {
    const isProd = process.env.NODE_ENV === 'production';
    const create = isProd ? production : development;
    return create(inlineConfig);
}
