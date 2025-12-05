export default defineEventHandler(async () => {
  const keys = await useStorage('data').getKeys('user:')

  const allUsers = await Promise.all(
    keys.map(async key => await useStorage('data').getItem(key)),
  )

  const leaderboard = allUsers
    .filter((u: any) => u && u.score)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 50)
    .map((u: any) => ({
      name: u.username,
      description: `Score: ${u.score}`,
      avatar: u.avatar,
      score: u.score,
      to: `https://github.com/${u.username}`,
      target: '_blank',
    }))

  return leaderboard
})
