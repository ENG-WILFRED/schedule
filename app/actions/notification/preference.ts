'use server'

import { prisma } from '../../../lib/prisma'

export type NotificationPreferenceInput = {
  routineId: number
  type: 'email' | 'sms'
  recipient: string
  templateId: number
  enabled?: boolean
}

export async function getPreference(routineId: number, type: 'email' | 'sms') {
  try {
    const preference = await prisma.notificationPreference.findUnique({
      where: {
        routineId_type: {
          routineId,
          type
        }
      },
      include: { template: true, routine: true }
    })
    return { preference }
  } catch (e) {
    console.error('Error fetching preference:', e)
    throw new Error('Failed to fetch preference')
  }
}

export async function getPreferencesForRoutine(routineId: number) {
  try {
    const preferences = await prisma.notificationPreference.findMany({
      where: { routineId },
      include: { template: true }
    })
    return { preferences }
  } catch (e) {
    console.error('Error fetching preferences:', e)
    throw new Error('Failed to fetch preferences')
  }
}

export async function getAllPreferences() {
  try {
    const preferences = await prisma.notificationPreference.findMany({
      include: { template: true, routine: true },
      orderBy: { routineId: 'asc' }
    })
    return { preferences }
  } catch (e) {
    console.error('Error fetching all preferences:', e)
    throw new Error('Failed to fetch preferences')
  }
}

export async function upsertPreference(data: NotificationPreferenceInput) {
  try {
    // Validate recipient format
    if (data.type === 'email' && !data.recipient.includes('@')) {
      throw new Error('Invalid email address')
    }
    if (data.type === 'sms' && !/^\+?[\d\s-()]{10,}$/.test(data.recipient)) {
      throw new Error('Invalid phone number')
    }

    const preference = await prisma.notificationPreference.upsert({
      where: {
        routineId_type: {
          routineId: data.routineId,
          type: data.type
        }
      },
      update: {
        recipient: data.recipient,
        templateId: data.templateId,
        enabled: data.enabled !== undefined ? data.enabled : true
      },
      create: {
        routineId: data.routineId,
        type: data.type,
        recipient: data.recipient,
        templateId: data.templateId,
        enabled: data.enabled !== undefined ? data.enabled : true
      },
      include: { template: true }
    })
    return { preference }
  } catch (e) {
    console.error('Error upserting preference:', e)
    throw new Error('Failed to save preference')
  }
}

export async function deletePreference(routineId: number, type: 'email' | 'sms') {
  try {
    await prisma.notificationPreference.delete({
      where: {
        routineId_type: {
          routineId,
          type
        }
      }
    })
    return { success: true }
  } catch (e) {
    console.error('Error deleting preference:', e)
    throw new Error('Failed to delete preference')
  }
}

export async function togglePreference(routineId: number, type: 'email' | 'sms') {
  try {
    const pref = await prisma.notificationPreference.findUnique({
      where: {
        routineId_type: {
          routineId,
          type
        }
      }
    })

    if (!pref) throw new Error('Preference not found')

    const updated = await prisma.notificationPreference.update({
      where: { id: pref.id },
      data: { enabled: !pref.enabled },
      include: { template: true }
    })
    return { preference: updated }
  } catch (e) {
    console.error('Error toggling preference:', e)
    throw new Error('Failed to toggle preference')
  }
}
