'use server'

import { Kafka } from 'kafkajs';
import NotificationProducer, { NotificationPayload } from './producer';
import { prisma } from '../../../lib/prisma';

let kafkaProducer: NotificationProducer | null = null;

/**
 * Initialize and get the Kafka notification producer instance
 */
function getKafkaProducer(): NotificationProducer {
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
    });

    kafkaProducer = new NotificationProducer(kafka, process.env.KAFKA_NOTIFICATION_TOPIC || 'notifications');
  }

  return kafkaProducer;
}

/**
 * Send a notification directly to Kafka (without template processing)
 */
export async function sendNotificationToKafka(notification: {
  type: 'email' | 'sms'
  title: string
  message: string
  templateId: number
  recipient: string
  metadata?: Record<string, any>
}): Promise<void> {
  try {
    const producer = getKafkaProducer()

    if (!producer) {
      throw new Error('Failed to initialize Kafka producer')
    }

    await producer.sendNotification({
      userId: notification.recipient,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      templateId: notification.templateId,
      metadata: {
        ...notification.metadata,
      },
    })
  } catch (error) {
    console.error('Error sending notification to Kafka:', error)
    throw error
  }
}

/**
 * Send a notification via Kafka with template data from the database
 */
export async function sendNotificationWithTemplate(
  routineId: number,
  type: 'email' | 'sms',
  recipient: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    // Fetch the notification preference with template
    const preference = await prisma.notificationPreference.findUnique({
      where: {
        routineId_type: {
          routineId,
          type,
        },
      },
      include: {
        template: true,
        routine: true,
      },
    });

    if (!preference || !preference.enabled) {
      console.log(`Notification preference not found or disabled for routine ${routineId} (${type})`);
      return;
    }

    const producer = getKafkaProducer();

    // Ensure producer is connected
    if (!producer) {
      throw new Error('Failed to initialize Kafka producer');
    }

    // Send notification with template ID
    await producer.sendNotification({
      userId: recipient,
      type,
      title: preference.template.name,
      message: preference.template.body,
      templateId: preference.template.id,
      metadata: {
        routineId,
        routineName: preference.routine?.name,
        recipient,
        ...metadata,
      },
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

/**
 * Initialize the Kafka producer connection
 */
export async function initializeKafkaProducer(): Promise<void> {
  try {
    const producer = getKafkaProducer();
    await producer.connect();
  } catch (error) {
    console.error('Failed to initialize Kafka producer:', error);
    throw error;
  }
}

/**
 * Disconnect the Kafka producer
 */
export async function disconnectKafkaProducer(): Promise<void> {
  try {
    if (kafkaProducer) {
      await kafkaProducer.disconnect();
      kafkaProducer = null;
    }
  } catch (error) {
    console.error('Failed to disconnect Kafka producer:', error);
    throw error;
  }
}

export { NotificationProducer };
export type { NotificationPayload };
export { checkAndTriggerNotifications, getScheduleStats } from './scheduler';
