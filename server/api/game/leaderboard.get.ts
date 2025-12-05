import type { LeaderboardEntry, StoredUser } from '~~/shared/types/game'

export default defineEventHandler(async (): Promise<LeaderboardEntry[]> => {
  const keys = await useStorage('data').getKeys('user:')

  const storageItems = await Promise.all(
    keys.map(key => useStorage('data').getItem<StoredUser>(key)),
  )

  const leaderboard: LeaderboardEntry[] = storageItems
    .filter((u): u is StoredUser => !!u && typeof u.score === 'number')
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map(u => ({
      name: u.username,
      description: `Score: ${u.score}`,
      avatar: u.avatar,
      score: u.score,
      to: `https://github.com/${u.username}`,
      target: '_blank',
    }))

  return leaderboard
})
