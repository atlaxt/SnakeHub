<script setup lang="ts">
const { loggedIn } = useUserSession()
const score = ref<number>(0)
const leaderboardRef = ref()

async function handleGameOver(finalScore: number) {
  if (loggedIn.value && finalScore > 0) {
    try {
      await $fetch('/api/game/save-score', {
        method: 'POST',
        body: { score: finalScore },
      })

      if (leaderboardRef.value) {
        leaderboardRef.value.refresh()
      }
    }
    catch (e) {
      console.error('Failed to save score:', e)
    }
  }
}
</script>

<template>
  <UContainer class="py-6 min-h-screen flex flex-col gap-6">
    <AppHeader :score="score" />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-4 w-full">
        <Leadboard ref="leaderboardRef" />

        <UButton
          target="_blank" variant="outline" class="mt-2 w-full" color="neutral" icon="i-simple-icons-github"
          label="GitHub" to="https://github.com/atlaxt/SnakeHub"
        />
        <UColorModeSelect class="w-full mt-2 mb-2" />
        <div class="text-center text-xs text-muted font-mono">
          v1.0.0
        </div>
      </div>

      <div class="lg:col-span-8 flex justify-center">
        <SnakeGame
          @update:score="(nw) => score = nw"
          @game-state="(state) => {
            if (state === 'gameover') handleGameOver(score)
          }"
        />
      </div>
    </div>
  </UContainer>
</template>
