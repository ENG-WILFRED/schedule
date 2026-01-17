'use server'

import { Kafka } from 'kafkajs'
import { prisma } from '../../../lib/prisma'

let kafkaProducer: any = null

/**
 * Get Kafka producer instance
 */
function getKafkaProducer() {
  if (!kafkaProducer) {
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

    kafkaProducer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 60000,
    })
  }

  return kafkaProducer
}

export interface NotificationRequest {
  routineId: number
  type: 'email' | 'sms'
  recipient?: string
  variables: Record<string, string | number>
}

/**
 * Interpolate variables into template strings
 * e.g., "Hello {{name}}" with {name: "John"} => "Hello John"
 */
function interpolateTemplate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key]
    return value !== undefined ? String(value) : match
  })
}

/**
 * Extract required keys from template
 * e.g., "Hello {{name}}, you have {{count}} messages" => ["name", "count"]
 */
function extractTemplateKeys(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g) || []
  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
}

/**
 * Trigger a notification for a routine with variable substitution
 */
export async function triggerNotification(request: NotificationRequest): Promise<{ logId: number }> {
  let logId: number | null = null

  try {
    // Get preference and template
    const preference = await prisma.notificationPreference.findUnique({
      where: {
        routineId_type: {
          routineId: request.routineId,
          type: request.type,
        },
      },
      include: {
        template: true,
        routine: true,
      },
    })

    if (!preference || !preference.enabled) {
      console.log(`Notification preference not found or disabled for routine ${request.routineId}`)
      return { logId: -1 }
    }

    const template = preference.template
    const recipient = request.recipient || preference.recipient

    // Validate required variables
    const requiredKeys = extractTemplateKeys(template.body)
    if (template.subject) {
      requiredKeys.push(...extractTemplateKeys(template.subject))
    }
    const uniqueKeys = [...new Set(requiredKeys)]

    const missingKeys = uniqueKeys.filter(key => request.variables[key] === undefined)
    if (missingKeys.length > 0) {
      throw new Error(`Missing required template variables: ${missingKeys.join(', ')}`)
    }

    // Interpolate templates
    const interpolatedBody = interpolateTemplate(template.body, request.variables)
    const interpolatedSubject = template.subject ? interpolateTemplate(template.subject, request.variables) : undefined

    // Create notification log entry
    const notificationLog = await prisma.notificationLog.create({
      data: {
        routineId: request.routineId,
        type: request.type,
        recipient,
        subject: interpolatedSubject || template.name,
        body: interpolatedBody,
        status: 'pending',
      },
    })

    logId = notificationLog.id

    // Prepare metadata
    const metadata = {
      routineId: request.routineId,
      routineName: preference.routine?.name,
      type: request.type,
      recipient,
      variables: request.variables,
      logId: notificationLog.id,
    }

    // Send to Kafka
    const producer = getKafkaProducer()
    await producer.connect()

    const payload = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: recipient,
      type: request.type,
      title: interpolatedSubject || template.name,
      message: interpolatedBody,
      templateId: template.id,
      metadata,
      timestamp: Date.now(),
    }

    const result = await producer.send({
      topic: process.env.KAFKA_NOTIFICATION_TOPIC || 'notifications',
      messages: [
        {
          key: recipient,
          value: JSON.stringify(payload),
          headers: {
            'correlation-id': Buffer.from(`${Date.now()}`),
            'notification-type': Buffer.from(request.type),
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

    console.log(`Notification triggered for routine ${request.routineId} (${request.type}) - Log ID: ${notificationLog.id}`)

    return { logId: notificationLog.id }
  } catch (error) {
    // Update log status to failed if log was created
    if (logId) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await prisma.notificationLog.update({
        where: { id: logId },
        data: {
          status: 'failed',
          error: errorMessage,
        },
      })
    }

    console.error('Error triggering notification:', error)
    throw error
  }
}

/**
 * Trigger notifications for all enabled preferences of a routine
 */
export async function triggerAllNotificationsForRoutine(
  routineId: number,
  variables: Record<string, string | number>
): Promise<void> {
  try {
    const preferences = await prisma.notificationPreference.findMany({
      where: {
        routineId,
        enabled: true,
      },
    })

    for (const preference of preferences) {
      await triggerNotification({
        routineId,
        type: preference.type as 'email' | 'sms',
        recipient: preference.recipient,
        variables,
      })
    }
  } catch (error) {
    console.error('Error triggering all notifications:', error)
    throw error
  }
}

/**
 * Validate that all required variables are provided
 */
export async function validateNotificationVariables(
  templateBody: string,
  templateSubject: string | undefined,
  variables: Record<string, string | number>
): Promise<{ valid: boolean; missingKeys: string[] }> {
  const requiredKeys = extractTemplateKeys(templateBody)
  if (templateSubject) {
    requiredKeys.push(...extractTemplateKeys(templateSubject))
  }
  const uniqueKeys = [...new Set(requiredKeys)]

  const missingKeys = uniqueKeys.filter(key => variables[key] === undefined)

  return {
    valid: missingKeys.length === 0,
    missingKeys,
  }
}

/**
 * Get required template variables
 */
export async function getTemplateVariables(template: { body: string; subject?: string | null }): Promise<string[]> {
  const requiredKeys = extractTemplateKeys(template.body)
  if (template.subject) {
    requiredKeys.push(...extractTemplateKeys(template.subject))
  }
  return [...new Set(requiredKeys)]
}
