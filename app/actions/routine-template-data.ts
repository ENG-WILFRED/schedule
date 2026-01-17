'use server'

import { prisma } from '../../lib/prisma'

/**
 * Template data structure with all variables needed for notification templates
 */
export interface RoutineTemplateData {
  id: number
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: string
  templateVars: {
    routineName: string
    startTime: string
    endTime: string
    minutesBefore: string[] // Array of notification times
  }
  preferences?: {
    id: number
    type: 'email' | 'sms'
    recipient: string
    templateId: number
    templateName: string
    enabled: boolean
  }[]
}

/**
 * Prepare routine data with all template variables needed for notifications
 * This is a utility function, not a server action
 */
function prepareRoutineTemplateData(routine: any): RoutineTemplateData {
  const notifyBefore = routine.notifyBefore
    ? routine.notifyBefore
        .split(',')
        .map((m: string) => m.trim())
        .filter((m: string) => m && !isNaN(parseInt(m)))
    : []

  return {
    id: routine.id,
    name: routine.name,
    start: routine.start,
    end: routine.end,
    strict: routine.strict,
    notifyBefore: routine.notifyBefore || '',
    templateVars: {
      routineName: routine.name,
      startTime: routine.start,
      endTime: routine.end,
      minutesBefore: notifyBefore
    },
    preferences: routine.preferences?.map((pref: any) => ({
      id: pref.id,
      type: pref.type as 'email' | 'sms',
      recipient: pref.recipient,
      templateId: pref.templateId,
      templateName: pref.template?.name || '',
      enabled: pref.enabled
    })) || []
  }
}

/**
 * Get all routines with complete template data for notifications
 */
export async function getAllRoutinesWithTemplateData() {
  try {
    const routines = await prisma.routine.findMany({
      include: {
        preferences: {
          include: { template: { select: { name: true } } }
        }
      },
      orderBy: { start: 'asc' }
    })

    if (!routines || routines.length === 0) {
      throw new Error('No routines found. Please seed the database.')
    }

    return routines.map(prepareRoutineTemplateData)
  } catch (error) {
    console.error('Error fetching routines with template data:', error)
    throw error
  }
}

/**
 * Get single routine with complete template data
 */
export async function getRoutineWithTemplateData(routineId: number) {
  try {
    const routine = await prisma.routine.findUniqueOrThrow({
      where: { id: routineId },
      include: {
        preferences: {
          include: { template: { select: { name: true } } }
        }
      }
    })

    return prepareRoutineTemplateData(routine)
  } catch (error) {
    console.error(`Error fetching routine ${routineId} with template data:`, error)
    throw error
  }
}

/**
 * Get routines filtered by notification type
 */
export async function getRoutinesWithNotifications(type?: 'email' | 'sms') {
  try {
    const routines = await prisma.routine.findMany({
      include: {
        preferences: {
          where: type ? { type, enabled: true } : { enabled: true },
          include: { template: { select: { name: true } } }
        }
      },
      where: {
        preferences: {
          some: {
            enabled: true,
            ...(type && { type })
          }
        }
      },
      orderBy: { start: 'asc' }
    })

    return routines.map(prepareRoutineTemplateData)
  } catch (error) {
    console.error('Error fetching routines with notifications:', error)
    throw error
  }
}
