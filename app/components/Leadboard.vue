<script setup lang="ts">
const { user } = useUserSession()

const { data: leaderboard, pending, refresh } = useAsyncData<LeaderboardEntry[]>('leaderboard', () =>
  $fetch('/api/game/leaderboard'))

defineExpose({ refresh })

onMounted(() => {
  refresh()
})
</script>

<template>
  <UCard class="h-full max-h-[600px] flex flex-col">
    <template #header>
      <div class="flex items-center justify-between py-1">
        <h3 class="font-extrabold text-xl flex items-center gap-2">
          <UIcon name="streamline-pixel:entertainment-events-hobbies-reward-winner-talent" class="text-yellow-400 text-2xl" />
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
            Top Scorers
          </span>
        </h3>
        <UButton
          icon="i-heroicons-arrow-path"
          variant="ghost"
          color="neutral"
          size="sm"
          :loading="pending"
          @click="refresh()"
        />
      </div>
    </template>

    <div
      class="overflow-y-auto max-h-[500px] space-y-1 custom-scrollbar p-0"
      :class="{ 'min-h-[200px] flex items-center justify-center': !leaderboard?.length }"
    >
      <div v-if="pending" class="space-y-2 p-3">
        <USkeleton v-for="i in 4" :key="i" class="h-14 w-full" />
      </div>

      <div v-else-if="!leaderboard?.length" class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-3xl text-gray-400 dark:text-gray-600 mb-2" />
        <p class="font-semibold text-lg text-gray-500 dark:text-gray-400">
          LEADERBOARD IS EMPTY
        </p>
        <p class="text-sm text-gray-400 dark:text-gray-500">
          Be the first to score!
        </p>
      </div>

      <NuxtLink
        v-for="(u, index) in leaderboard"
        v-else
        :key="u.name"
        :to="u.to"
        :target="u.target"
        class="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border border-transparent hover:border-primary-500/50"
        :class="{
          'bg-gray-50 dark:bg-gray-800/50 border-primary-500/20 shadow-inner': user && u.name === user.login,
          'hover:bg-gray-100 dark:hover:bg-gray-800': user?.login !== u.name,
        }"
      >
        <span
          class="font-mono w-6 text-center text-lg font-bold transition-colors"
          :class="{
            'text-yellow-500': index === 0,
            'text-gray-500 dark:text-gray-400': index > 0,
            'text-xl': index < 3,
          }"
        >
          {{ index + 1 }}
        </span>

        <UAvatar :src="u.avatar" :alt="u.name" size="lg" class="ring-2 ring-primary-500/30" />

        <div class="flex-1 min-w-0">
          <p class="text-base font-semibold text-gray-900 dark:text-white truncate">
            {{ u.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate font-mono mt-0.5">
            {{ u.description }}
          </p>
        </div>

        <UIcon v-if="user && u.name === user.login" name="i-heroicons-star-solid" class="text-yellow-400 text-xl" />
      </NuxtLink>
    </div>
  </UCard>
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
