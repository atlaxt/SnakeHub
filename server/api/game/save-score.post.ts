export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const user = session.user

  const body = await readBody(event)
  const newScore = Number.parseInt(body.score)

  if (!newScore || newScore <= 0) {
    return { success: false, message: 'Invalid score' }
  }

  const userKey = `user:${user.id}`

  const existingData = await useStorage('data').getItem(userKey) as any || {}
  const currentBest = existingData.score || 0

  if (newScore > currentBest) {
    await useStorage('data').setItem(userKey, {
      username: user.login,
      avatar: user.avatar_url,
      score: newScore,
      updatedAt: new Date().toISOString(),
    })
    return { success: true, newHighScore: true }
  }

  return { success: true, newHighScore: false }
})
