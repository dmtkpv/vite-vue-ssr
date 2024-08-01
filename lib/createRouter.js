import { createRouter as createVueRouter, createWebHistory, createMemoryHistory } from 'vue-router'

export default function createRouter ({ base, ...options }) {
    const isSSR = typeof window === 'undefined';
    const history = isSSR ? createMemoryHistory(base) : createWebHistory(base);
    return createVueRouter({ ...options, history });
}