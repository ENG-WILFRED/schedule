'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getTrendData() {
  try {
    const routines = await prisma.routine.findMany({
      include: { stats: true }
    })

    const trends = await Promise.all(
      routines.map(async (routine) => {
        const today = new Date()
        const monday = new Date(today)
        monday.setDate(today.getDate() - today.getDay() + 1)

        const week = []
        let completed = 0
        let total = 0

        for (let i = 0; i < 7; i++) {
          const date = new Date(monday)
          date.setDate(monday.getDate() + i)
          const dateStr = date.toISOString().split('T')[0]

          const logs = await prisma.dailyLog.findMany({
            where: { date: dateStr, blockId: routine.id }
          })

          const dayCompleted = logs.filter(l => l.status === 'done').length
          const dayMissed = logs.filter(l => l.status === 'missed').length
          const dayTotal = dayCompleted + dayMissed

          week.push({
            date: dateStr,
            completed: dayCompleted,
            missed: dayMissed,
            total: dayTotal
          })

          completed += dayCompleted
          total += dayTotal
        }

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

        return {
          routine: routine.name,
          week,
          completionRate,
          streak: 0
        }
      })
    )

    return { trends }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch trends')
  }
}
