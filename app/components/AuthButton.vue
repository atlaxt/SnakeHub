<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { loggedIn, user, clear } = useUserSession()

const items = [
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: clear,
    },
  ],
] satisfies DropdownMenuItem[][]
</script>

<template>
  <UButton
    v-if="!loggedIn"
    to="/api/auth/github"
    icon="i-simple-icons-github"
    label="Login with GitHub"
    color="neutral"
    external
    size="xs"
  />
  <UDropdownMenu
    v-if="user"
    :items="items"
  >
    <UButton
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
    >
      <UAvatar
        :src="`https://github.com/${user.login}.png`"
        :alt="user.login"
      />
      {{ user.login }}
    </UButton>
  </UDropdownMenu>
</template>
