export interface LeaderboardEntry {
  name: string
  avatar: string
  score: number
  description: string
  to: string
  target: string
}

export interface StoredUser {
  username: string
  avatar: string
  score: number
  updatedAt: string
}

export interface ScoreBody {
  score: number
}
