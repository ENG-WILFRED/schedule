'use server'

import { prisma } from '../../lib/prisma'

export async function getAchievements() {
  try {
    const achievements = await prisma.codingAchievement.findMany({
      orderBy: {
        unlockedAt: 'desc'
      }
    })

    return {
      achievements: achievements.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        unlockedAt: a.unlockedAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }))
    }
  } catch (error) {
    console.error('Failed to fetch achievements:', error)
    throw error
  }
}
