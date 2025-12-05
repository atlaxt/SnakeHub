<script setup lang="ts">
const { user } = useUserSession()
const { data: mockUsers, pending } = useAsyncData('users', () =>
  fetch('https://mockly.atlaxt.me/api/users')
    .then(res => res.json()))
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

      <div
        v-for="(u, index) in mockUsers" v-else :key="index"
        class="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors cursor-default group"
      >
        <span
          class="font-mono w-6 text-center group-hover:text-primary transition-colors"
          :class="{ 'font-bold text-highlighted text-lg text-yellow-500': index === 0, 'text-muted': index > 2 }"
        >
          {{ index + 1 }}
        </span>

        <UAvatar :src="u.avatar" :alt="u.name" size="md" class="ring-2 ring-secondary-100 dark:ring-secondary-800" />

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-secondary-900 dark:text-white truncate">
            {{ u.name }}
          </p>
          <p class="text-xs text-secondary-500 dark:text-secondary-400 truncate font-mono">
            {{ u.description }}
          </p>
        </div>

        <UIcon v-if="user && u.name === user.name" name="i-heroicons-user" class="text-primary" />
      </div>
    </div>
  </UCard>
</template>
