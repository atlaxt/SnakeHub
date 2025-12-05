// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-auth-utils'],

  devtools: {
    enabled: true,
  },

  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './.data/db',
      },
    },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',
})
