'use server'

import { prisma } from '../../../lib/prisma'
import { triggerAllNotificationsForRoutine } from './trigger'

/**
 * Check current time and trigger notifications for routines starting soon
 * This should be called periodically (e.g., every minute via cron job)
 */
export async function checkAndTriggerNotifications() {
  try {
    const now = new Date()
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
    
    console.log(`[Scheduler] Checking routines at ${currentTime}`)

    // Get all routines with their notification preferences
    const routines = await prisma.routine.findMany({
      include: {
        preferences: {
          where: { enabled: true },
          include: { template: true }
        }
      }
    })

    // For each routine, check if any notification time matches current time
    for (const routine of routines) {
      // Skip if no notification minutes are configured
      if (!routine.notifyBefore) continue

      // Parse notification minutes: "15,10" => [15, 10]
      const notifyMinutes = routine.notifyBefore
        .split(',')
        .map(m => parseInt(m.trim(), 10))
        .filter(m => !isNaN(m))

      // Parse routine start time: "09:00"
      const [startHour, startMin] = routine.start.split(':').map(Number)
      const [endHour, endMin] = routine.end.split(':').map(Number)

      // Check if current time matches any notification time
      for (const minutesBefore of notifyMinutes) {
        // Calculate when to notify (X minutes before start time)
        const notifyDate = new Date()
        notifyDate.setHours(startHour, startMin - minutesBefore, 0, 0)

        // Check if current time is within a 1-minute window of the notification time
        const timeDiff = Math.abs(now.getTime() - notifyDate.getTime())
        const isTimeToNotify = timeDiff < 60000 // within 60 seconds

        if (isTimeToNotify) {
          console.log(
            `[Scheduler] Triggering notification for routine "${routine.name}" ` +
            `(${minutesBefore} minutes before start)`
          )

          try {
            // Trigger notifications for all enabled preferences
            await triggerAllNotificationsForRoutine(routine.id, {
              routineName: routine.name,
              minutesBefore: String(minutesBefore),
              startTime: routine.start,
              endTime: routine.end,
            })

            console.log(`[Scheduler] Successfully triggered notifications for routine ${routine.id}`)
          } catch (error) {
            console.error(
              `[Scheduler] Failed to trigger notifications for routine ${routine.id}:`,
              error
            )
          }
        }
      }
    }

    return { success: true, message: 'Notification check completed' }
  } catch (error) {
    console.error('[Scheduler] Error checking notifications:', error)
    throw error
  }
}

/**
 * Get statistics about scheduled notifications
 */
export async function getScheduleStats() {
  try {
    const routines = await prisma.routine.findMany({
      include: {
        preferences: {
          where: { enabled: true }
        }
      }
    })

    const stats = {
      totalRoutines: routines.length,
      routinesWithNotifications: routines.filter(r => r.notifyBefore && r.preferences.length > 0).length,
      totalPreferences: routines.reduce((sum, r) => sum + r.preferences.length, 0),
      routineDetails: routines.map(r => ({
        id: r.id,
        name: r.name,
        start: r.start,
        end: r.end,
        notifyBefore: r.notifyBefore,
        enabledPreferences: r.preferences.length
      }))
    }

    return stats
  } catch (error) {
    console.error('[Scheduler] Error getting stats:', error)
    throw error
  }
}
