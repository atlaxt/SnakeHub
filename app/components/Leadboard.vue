<script setup lang="ts">
const { user } = useUserSession()

const { data: leaderboard, pending, refresh } = useAsyncData('leaderboard', () =>
  $fetch('/api/game/leaderboard'))

defineExpose({ refresh })
</script>

<template>
  <UCard class="h-full max-h-[600px] flex flex-col">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-bold flex items-center gap-2">
          <UIcon name="i-heroicons-trophy" class="text-yellow-500" />
          Leaderboard
        </h3>
      </div>
    </template>

    <div class="overflow-y-auto max-h-[500px] space-y-2 custom-scrollbar">
      <div v-if="pending" class="space-y-3">
        <USkeleton v-for="i in 5" :key="i" class="h-12 w-full" />
      </div>

      <div v-else-if="!leaderboard?.length" class="text-center text-gray-500 py-4">
        No scores yet. Be the first!
      </div>

      <div
        v-for="(u, index) in leaderboard" v-else :key="index"
        class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-default group"
      >
        <span
          class="font-mono w-6 text-center group-hover:text-primary transition-colors"
          :class="{ 'font-bold text-lg text-yellow-500': index === 0, 'text-gray-400': index > 2 }"
        >
          {{ index + 1 }}
        </span>

        <UAvatar :src="u.avatar" :alt="u.name" size="md" class="ring-2 ring-gray-100 dark:ring-gray-800" />

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ u.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
            {{ u.description }}
          </p>
        </div>

        <UIcon v-if="user && u.name === user.login" name="i-heroicons-user" class="text-primary" />
      </div>
    </div>
  </UCard>
</template>
