import type { ScoreBody, StoredUser } from '~~/shared/types/game'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const user = session.user

  const body = await readBody<ScoreBody>(event)
  const newScore = Number(body?.score)

  if (!newScore || newScore <= 0) {
    return { success: false, message: 'Invalid score' }
  }

  const userKey = `user:${user.id}`

  const existingData = await useStorage('data').getItem<StoredUser>(userKey)
  const currentBest = existingData?.score || 0

  if (newScore > currentBest) {
    const userData: StoredUser = {
      username: user.login,
      avatar: user.avatar_url,
      score: newScore,
      updatedAt: new Date().toISOString(),
    }

    await useStorage('data').setItem(userKey, userData)
    return { success: true, newHighScore: true }
  }

  return { success: true, newHighScore: false }
})
