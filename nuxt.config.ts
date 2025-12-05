// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-auth-utils'],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {

  },

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',
})
