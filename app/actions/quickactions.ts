'use server'

import { prisma } from '../../lib/prisma'

export async function getQuickActions() {
  try {
    const actions = await prisma.quickAction.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { actions }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch actions')
  }
}

export async function createQuickAction(data: { name: string; emoji: string; description?: string; color: string }) {
  try {
    const action = await prisma.quickAction.create({
      data
    })
    return { action }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create action')
  }
}

export async function getQuickActionLogs(date: string) {
  try {
    if (!date) {
      throw new Error('Date parameter required')
    }

    const logs = await prisma.quickActionLog.findMany({
      where: { date },
      include: { action: true }
    })

    const grouped = logs.reduce((acc, log) => {
      const existing = acc.find(l => l.actionId === log.actionId)
      if (existing) {
        existing.count += log.count
      } else {
        acc.push({ actionId: log.actionId, count: log.count })
      }
      return acc
    }, [] as Array<{ actionId: number; count: number }>)

    return { logs: grouped }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch logs')
  }
}

export async function createQuickActionLog(data: { actionId: number; date: string; time: string; count?: number }) {
  try {
    const log = await prisma.quickActionLog.create({
      data: {
        ...data,
        count: data.count || 1
      }
    })
    return { log }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create log')
  }
}

export async function deleteQuickAction(actionId: number) {
  try {
    await prisma.quickAction.delete({
      where: { id: actionId }
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete action')
  }
}
