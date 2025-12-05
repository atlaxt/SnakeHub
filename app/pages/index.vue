<script setup lang="ts">
const score = ref<number>(0)
</script>

<template>
  <UContainer class="py-6 min-h-screen flex flex-col gap-6">
    <AppHeader :score="score" />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-4 w-full">
        <Leadboard />
        <UButton
          target="_blank" variant="outline" class="mt-2 w-full" color="neutral" icon="i-simple-icons-github"
          label="GitHub" to="https://github.com/atlaxt/SnakeHub"
        />
        <UColorModeSelect class="w-full mt-2 mb-2" />
        v1.0.0
      </div>

      <div class="lg:col-span-8 flex justify-center">
        <SnakeGame @update:score="(nw) => score = nw" />
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
</style>
