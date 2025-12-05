import process from 'node:process'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-auth-utils'],

  devtools: {
    enabled: true,
  },

  nitro: {
    // local
    // // storage: {
    // //   data: {
    // //     driver: 'fs',
    // //     base: './.data/db',
    // //   },
    // // },

    // production
    storage: {
      data: {
        driver: process.env.NUXT_STORAGE_DRIVER || 'fs',
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
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
