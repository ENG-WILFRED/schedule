import { prisma } from '../../../lib/prisma'
import { sendEmail } from './email'
import { sendSms } from './sms'

export type NotificationBlock = {
  id?: number
  name: string
  start: string
  end: string
}

function interpolateTemplate(
  template: string,
  block: NotificationBlock,
  minutesBefore: number
): string {
  return template
    .replace(/{{blockName}}/g, block.name)
    .replace(/{{startTime}}/g, block.start)
    .replace(/{{endTime}}/g, block.end)
    .replace(/{{minutesBefore}}/g, minutesBefore.toString())
}

export async function sendNotificationForRoutine(
  routineId: number,
  minutesBefore: number
) {
  try {
    // Get routine
    const routine = await prisma.routine.findUnique({
      where: { id: routineId }
    })

    if (!routine) {
      console.log(`Routine ${routineId} not found`)
      return
    }

    // Get all enabled preferences for this routine
    const preferences = await prisma.notificationPreference.findMany({
      where: { routineId, enabled: true },
      include: { template: true }
    })

    // Get default templates per type for fallback
    const [defaultEmail, defaultSms] = await Promise.all([
      prisma.notificationTemplate.findFirst({
        where: { type: 'email', isDefault: true }
      }),
      prisma.notificationTemplate.findFirst({
        where: { type: 'sms', isDefault: true }
      })
    ])

    if (preferences.length === 0) {
      console.log(`No notification preferences for routine ${routineId}`)
      return
    }

    for (const pref of preferences) {
      const template = pref.template
      const body = interpolateTemplate(template.body, routine, minutesBefore)

      try {
        if (pref.type === 'email') {
          const subject = interpolateTemplate(template.subject || '', routine, minutesBefore)
          await sendEmail(pref.recipient, subject, body)

          // Log successful send
          await prisma.notificationLog.create({
            data: {
              routineId,
              type: 'email',
              recipient: pref.recipient,
              subject,
              body,
              status: 'sent'
            }
          })
        } else if (pref.type === 'sms') {
          await sendSms(pref.recipient, body)

          // Log successful send
          await prisma.notificationLog.create({
            data: {
              routineId,
              type: 'sms',
              recipient: pref.recipient,
              body,
              status: 'sent'
            }
          })
        }
      } catch (e) {
        console.error(`Failed to send ${pref.type} notification:`, e)

        // Log failed send
        await prisma.notificationLog.create({
          data: {
            routineId,
            type: pref.type,
            recipient: pref.recipient,
            body,
            status: 'failed',
            error: String(e)
          }
        })
      }
    }
  } catch (e) {
    console.error('Error sending notifications:', e)
  }
}

export async function sendNotificationWithDefaultFallback(
  routineId: number,
  type: 'email' | 'sms',
  recipient: string,
  minutesBefore: number
) {
  try {
    // Get routine
    const routine = await prisma.routine.findUnique({
      where: { id: routineId }
    })

    if (!routine) {
      console.log(`Routine ${routineId} not found`)
      return
    }

    // Get preference for this routine+type, or use default template
    const pref = await prisma.notificationPreference.findUnique({
      where: {
        routineId_type: { routineId, type }
      },
      include: { template: true }
    })

    const template = pref?.template || 
      await prisma.notificationTemplate.findFirst({
        where: { type, isDefault: true }
      })

    if (!template) {
      console.log(`No template found for ${type}, even default is missing`)
      return
    }

    const body = interpolateTemplate(template.body, routine, minutesBefore)

    try {
      if (type === 'email') {
        const subject = interpolateTemplate(template.subject || '', routine, minutesBefore)
        await sendEmail(recipient, subject, body)

        await prisma.notificationLog.create({
          data: {
            routineId,
            type: 'email',
            recipient,
            subject,
            body,
            status: 'sent'
          }
        })
      } else if (type === 'sms') {
        await sendSms(recipient, body)

        await prisma.notificationLog.create({
          data: {
            routineId,
            type: 'sms',
            recipient,
            body,
            status: 'sent'
          }
        })
      }
    } catch (e) {
      console.error(`Failed to send ${type} notification:`, e)

      await prisma.notificationLog.create({
        data: {
          routineId,
          type,
          recipient,
          body,
          status: 'failed',
          error: String(e)
        }
      })
    }
  } catch (e) {
    console.error('Error in sendNotificationWithDefaultFallback:', e)
  }
}

export async function getNotificationLogs(routineId?: number) {
  try {
    const logs = await prisma.notificationLog.findMany({
      where: routineId ? { routineId } : undefined,
      orderBy: { sentAt: 'desc' },
      take: 50
    })
    return { logs }
  } catch (e) {
    console.error('Error fetching notification logs:', e)
    throw new Error('Failed to fetch logs')
  }
}
