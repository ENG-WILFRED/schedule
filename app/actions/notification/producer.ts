import { Kafka, Producer } from 'kafkajs';

// Simple logger utility for server-side logging
const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'INFO', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, meta?: Record<string, any>) => {
    console.error(JSON.stringify({ level: 'ERROR', message, ...meta, timestamp: new Date().toISOString() }));
  },
};

export interface NotificationPayload {
  id: string;
  userId?: string;
  type: 'email' | 'sms';
  title: string;
  message: string;
  templateId: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

export class NotificationProducer {
  private producer: Producer;
  private topic: string;

  constructor(kafka: Kafka, topic: string = 'notifications') {
    this.producer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 60000,
    });
    this.topic = topic;
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      logger.info('Notification producer connected', { source: 'PRODUCER' });
    } catch (error) {
      logger.error('Failed to connect producer', { error: String(error), source: 'PRODUCER' });
      throw error;
    }
  }

  async sendNotification(notification: {
    id?: string;
    userId?: string;
    type: 'email' | 'sms';
    title: string;
    message: string;
    templateId: number;
    metadata?: Record<string, any>;
    timestamp?: number;
  }): Promise<void> {
    try {
      const payload: NotificationPayload = {
        id: notification.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        templateId: notification.templateId,
        metadata: notification.metadata || {},
        timestamp: notification.timestamp || Date.now(),
      };

      const result = await this.producer.send({
        topic: this.topic,
        messages: [
          {
            key: notification.userId || payload.id,
            value: JSON.stringify(payload),
            headers: {
              'correlation-id': Buffer.from(`${Date.now()}`),
              'notification-type': Buffer.from(notification.type),
              'template-id': Buffer.from(String(notification.templateId)),
            },
          },
        ],
      });

      logger.info('Notification sent successfully', {
        source: 'PRODUCER',
        topic: this.topic,
        userId: notification.userId,
        type: notification.type,
        templateId: notification.templateId,
        partition: result[0].partition,
        offset: result[0].offset,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to send notification', {
        error: String(error),
        source: 'PRODUCER',
        userId: notification.userId,
        type: notification.type,
        templateId: notification.templateId,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      logger.info('Notification producer disconnected', { source: 'PRODUCER' });
    } catch (error) {
      logger.error('Failed to disconnect producer', { error: String(error), source: 'PRODUCER' });
    }
  }
}

export default NotificationProducer;
