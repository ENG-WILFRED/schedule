import { Kafka } from 'kafkajs'
import { prisma } from './prisma'

/**
 * Utility functions for notification scheduling
 * Can be used from both API routes and server actions
 */

class KafkaProducerSingleton {
  private static instance: any = null

  static getInstance() {
    if (!KafkaProducerSingleton.instance) {
      const kafka = new Kafka({
        clientId: 'notification-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        connectionTimeout: 10000,
        requestTimeout: 30000,
        retry: {
          initialRetryTime: 100,
          retries: 8,
          maxRetryTime: 30000,
          multiplier: 2,
        },
      })
      KafkaProducerSingleton.instance = kafka.producer({
        allowAutoTopicCreation: true,
        transactionTimeout: 60000,
      })
    }
    return KafkaProducerSingleton.instance
  }
}

export function interpolateTemplate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key]
    return value !== undefined ? String(value) : match
  })
}

export function extractTemplateKeys(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g) || []
  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
}

export async function checkAndTriggerScheduledNotifications() {
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

    let triggeredCount = 0
    const producer = KafkaProducerSingleton.getInstance()

    try {
      await producer.connect()
    } catch (e) {
      console.warn('[Scheduler] Could not connect to Kafka producer, will continue without sending')
    }

    // For each routine, check if any notification time matches current time
    for (const routine of routines) {
      // Skip if no notification minutes are configured or no preferences
      if (!routine.notifyBefore || routine.preferences.length === 0) continue

      // Parse notification minutes: "15,10" => [15, 10]
      const notifyMinutes = routine.notifyBefore
        .split(',')
        .map(m => parseInt(m.trim(), 10))
        .filter(m => !isNaN(m))

      // Parse routine start time: "09:00"
      const [startHour, startMin] = routine.start.split(':').map(Number)

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

          // Trigger for each enabled preference
          for (const preference of routine.preferences) {
            try {
              const template = preference.template
              const recipient = preference.recipient

              // Prepare variables
              const variables = {
                routineName: routine.name,
                minutesBefore: String(minutesBefore),
                startTime: routine.start,
                endTime: routine.end,
              }

              // Validate required variables
              const requiredKeys = extractTemplateKeys(template.body)
              if (template.subject) {
                requiredKeys.push(...extractTemplateKeys(template.subject))
              }
              const uniqueKeys = [...new Set(requiredKeys)]
              const missingKeys = uniqueKeys.filter(key => variables[key as keyof typeof variables] === undefined)

              if (missingKeys.length > 0) {
                console.warn(
                  `[Scheduler] Skipping notification: missing variables: ${missingKeys.join(', ')}`
                )
                continue
              }

              // Interpolate templates
              const interpolatedBody = interpolateTemplate(template.body, variables)
              const interpolatedSubject = template.subject
                ? interpolateTemplate(template.subject, variables)
                : undefined

              // Create notification log
              const notificationLog = await prisma.notificationLog.create({
                data: {
                  routineId: routine.id,
                  type: preference.type as 'email' | 'sms',
                  recipient,
                  subject: interpolatedSubject || template.name,
                  body: interpolatedBody,
                  status: 'pending',
                }
              })

              // Send to Kafka if producer is available
              try {
                if (producer.isConnected()) {
                  const payload = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    userId: recipient,
                    type: preference.type,
                    title: interpolatedSubject || template.name,
                    message: interpolatedBody,
                    templateId: template.id,
                    metadata: {
                      routineId: routine.id,
                      routineName: routine.name,
                      type: preference.type,
                      recipient,
                      variables,
                      logId: notificationLog.id,
                    },
                    timestamp: Date.now(),
                  }

                  await producer.send({
                    topic: process.env.KAFKA_NOTIFICATION_TOPIC || 'notifications',
                    messages: [
                      {
                        key: recipient,
                        value: JSON.stringify(payload),
                        headers: {
                          'correlation-id': Buffer.from(`${Date.now()}`),
                          'notification-type': Buffer.from(preference.type),
                          'template-id': Buffer.from(String(template.id)),
                        },
                      },
                    ],
                  })

                  // Update log status to sent
                  await prisma.notificationLog.update({
                    where: { id: notificationLog.id },
                    data: {
                      status: 'sent',
                      sentAt: new Date(),
                    },
                  })

                  triggeredCount++
                  console.log(
                    `[Scheduler] Sent ${preference.type} notification to ${recipient} for routine ${routine.id}`
                  )
                }
              } catch (kafkaError) {
                console.error('[Scheduler] Kafka send failed, updating log as failed:', kafkaError)
                await prisma.notificationLog.update({
                  where: { id: notificationLog.id },
                  data: {
                    status: 'failed',
                    error: kafkaError instanceof Error ? kafkaError.message : 'Kafka send failed',
                  },
                })
              }
            } catch (error) {
              console.error(
                `[Scheduler] Failed to send notification for routine ${routine.id}:`,
                error
              )
            }
          }
        }
      }
    }

    return {
      message: 'Notification check completed',
      triggeredCount
    }
  } catch (error) {
    console.error('[Scheduler] Error checking notifications:', error)
    throw error
  }
}
