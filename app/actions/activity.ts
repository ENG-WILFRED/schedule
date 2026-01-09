'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getActivityLogs() {
  try {
    const logs = await prisma.dailyLog.findMany({
      include: { comments: true },
      orderBy: { date: 'desc' }
    })

    const logsWithNames = await Promise.all(
      logs.map(async (log) => ({
        ...log,
        routineName: `Block ${log.blockId}`
      }))
    )

    return { logs: logsWithNames }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch activity')
  }
}

export async function addComment(logId: number, text: string, target?: string, aim?: string) {
  try {
    const comment = await prisma.comment.create({
      data: { logId, text, target, aim }
    })
    return { comment }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create comment')
  }
}
