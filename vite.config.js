import { defineConfig } from 'vite';

// Served from https://tridinhbui.github.io/finance-pf/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/finance-pf/' : '/',
});
