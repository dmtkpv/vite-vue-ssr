import production from './ssr/production.js'
import development from './ssr/development.js'

export default function createSSR (options = {}) {
    const isProd = options.mode === 'production';
    const create = isProd ? production : development;
    return create(options);
}
