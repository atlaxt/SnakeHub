<script setup>
import { Analytics } from '@vercel/analytics/nuxt'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = 'SnakeHub'
const description = 'A snake game'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  // ogImage: '',
  // twitterImage: '',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp>
    <Analytics />
    <BgPixels class="" />
    <UMain>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>
  </UApp>
</template>
