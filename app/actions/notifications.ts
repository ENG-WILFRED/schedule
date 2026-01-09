'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getNotifications() {
  try {
    const notifications = await prisma.notification.findMany()
    return { notifications }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch notifications')
  }
}

export async function createNotification(routineId: number, minutesBefore: number) {
  try {
    const notification = await prisma.notification.create({
      data: { routineId, minutesBefore }
    })
    return { notification }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create notification')
  }
}

export async function getNotificationsByRoutineId(routineId: number) {
  try {
    if (Number.isNaN(routineId)) {
      throw new Error('Invalid routine id')
    }

    const notifications = await prisma.notification.findMany({
      where: { routineId }
    })
    return { notifications }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch notifications')
  }
}

export async function updateNotification(notificationId: number, enabled: boolean) {
  try {
    if (Number.isNaN(notificationId)) {
      throw new Error('Invalid notification id')
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { enabled }
    })
    return { notification }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to update notification')
  }
}

export async function deleteNotification(notificationId: number) {
  try {
    if (Number.isNaN(notificationId)) {
      throw new Error('Invalid notification id')
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete notification')
  }
}

export async function getProviderConfig() {
  try {
    const cfg = await prisma.notificationConfig.findFirst()
    return { config: cfg || null }
  } catch (e) {
    console.error('Error fetching provider config:', e)
    throw new Error('Failed to fetch providers')
  }
}

export async function saveProviderConfig(data: any) {
  try {
    const existing = await prisma.notificationConfig.findFirst()
    let cfg
    if (!existing) {
      cfg = await prisma.notificationConfig.create({ data })
    } else {
      cfg = await prisma.notificationConfig.update({ where: { id: existing.id }, data })
    }
    return { config: cfg }
  } catch (e) {
    console.error('Error saving provider config:', e)
    throw new Error('Failed to save providers')
  }
}
