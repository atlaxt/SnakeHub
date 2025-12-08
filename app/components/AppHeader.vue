<script setup lang="ts">
defineProps<{ score: number }>()
</script>

<template>
  <div class="bg-default flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-2 rounded-xl border border-default">
    <div class="flex items-center gap-2">
      <h1 class="text-3xl font-bold text-primary">
        SnakeHub
      </h1>
    </div>

    <div class="flex flex-col items-center">
      <span class="text-xs font-bold tracking-widest text-muted">CURRENT SCORE</span>
      <span
        class="text-3xl font-black font-mono transition-all duration-300 transform scale-100" :class="{
          'text-primary': score > 0,
          'text-muted': score <= 0,
        }"
      >
        {{ score.toString().padStart(4, '0') }}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <AuthButton />
    </div>
  </div>
</template>
