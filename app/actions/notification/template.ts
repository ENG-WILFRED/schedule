'use server'

import { prisma } from '../../../lib/prisma'

export type NotificationTemplateInput = {
  name: string
  description?: string
  type: 'email' | 'sms'
  subject?: string
  body: string
}

export async function getTemplates(type?: 'email' | 'sms') {
  try {
    const templates = await prisma.notificationTemplate.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'asc' }
    })
    return { templates }
  } catch (e) {
    console.error('Error fetching templates:', e)
    throw new Error('Failed to fetch templates')
  }
}

export async function getTemplate(id: number) {
  try {
    const template = await prisma.notificationTemplate.findUnique({
      where: { id }
    })
    if (!template) throw new Error('Template not found')
    return { template }
  } catch (e) {
    console.error('Error fetching template:', e)
    throw new Error('Failed to fetch template')
  }
}

export async function createTemplate(data: NotificationTemplateInput) {
  try {
    // Validate subject for email templates
    if (data.type === 'email' && !data.subject) {
      throw new Error('Email templates must have a subject')
    }

    const template = await prisma.notificationTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        subject: data.subject,
        body: data.body
      }
    })
    return { template }
  } catch (e) {
    console.error('Error creating template:', e)
    throw new Error('Failed to create template')
  }
}

export async function updateTemplate(
  id: number,
  data: Partial<NotificationTemplateInput>
) {
  try {
    const template = await prisma.notificationTemplate.update({
      where: { id },
      data
    })
    return { template }
  } catch (e) {
    console.error('Error updating template:', e)
    throw new Error('Failed to update template')
  }
}

export async function deleteTemplate(id: number) {
  try {
    // Check if template is in use
    const inUse = await prisma.notificationPreference.count({
      where: { templateId: id }
    })
    if (inUse > 0) {
      throw new Error('Cannot delete template in use')
    }

    await prisma.notificationTemplate.delete({
      where: { id }
    })
    return { success: true }
  } catch (e) {
    console.error('Error deleting template:', e)
    throw new Error('Failed to delete template')
  }
}

// Seed default templates
export async function seedTemplates() {
  try {
    // Default fallback templates (one per type)
    const defaultEmail = await prisma.notificationTemplate.upsert({
      where: { name: 'Default Email Reminder' },
      update: { isDefault: true },
      create: {
        name: 'Default Email Reminder',
        description: 'Default fallback email template for any routine',
        type: 'email',
        subject: '⏰ {{blockName}} starts in {{minutesBefore}} minutes',
        body: `<p>Your <strong>{{blockName}}</strong> block starts at <strong>{{startTime}}</strong>.</p>
<p>{{minutesBefore}} minutes to prepare.</p>`,
        isDefault: true
      }
    })

    const defaultSms = await prisma.notificationTemplate.upsert({
      where: { name: 'Default SMS Reminder' },
      update: { isDefault: true },
      create: {
        name: 'Default SMS Reminder',
        description: 'Default fallback SMS template for any routine',
        type: 'sms',
        body: '⏰ {{blockName}} at {{startTime}} ({{minutesBefore}} min)',
        isDefault: true
      }
    })

    // Specific routine templates
    const emailWorkout = await prisma.notificationTemplate.upsert({
      where: { name: 'Email Workout Reminder' },
      update: {},
      create: {
        name: 'Email Workout Reminder',
        description: 'Professional email reminder for workout blocks',
        type: 'email',
        subject: 'Reminder: {{blockName}} starts in {{minutesBefore}} minutes',
        body: `<h2>Time to Get Ready! 💪</h2>
<p>Your <strong>{{blockName}}</strong> block starts at <strong>{{startTime}}</strong>.</p>
<p>You have <strong>{{minutesBefore}} minutes</strong> to prepare.</p>
<p style="color: #666; margin-top: 20px; font-size: 12px;">Ends at {{endTime}}</p>`,
        isDefault: false
      }
    })

    const emailWork = await prisma.notificationTemplate.upsert({
      where: { name: 'Email Work Block' },
      update: {},
      create: {
        name: 'Email Work Block',
        description: 'Work block reminder with focus message',
        type: 'email',
        subject: 'Focus Time: {{blockName}} in {{minutesBefore}} min',
        body: `<h2>Time to Focus 🎯</h2>
<p>Your work block <strong>{{blockName}}</strong> is starting soon.</p>
<p>Put away distractions. You have until <strong>{{endTime}}</strong>.</p>
<p><em>Minimize notifications and go deep.</em></p>`,
        isDefault: false
      }
    })

    const smsFitness = await prisma.notificationTemplate.upsert({
      where: { name: 'SMS Fitness Alert' },
      update: {},
      create: {
        name: 'SMS Fitness Alert',
        description: 'Quick SMS reminder for physical activity',
        type: 'sms',
        body: '💪 {{blockName}} starts at {{startTime}}. {{minutesBefore}} min to prepare!',
        isDefault: false
      }
    })

    const smsWork = await prisma.notificationTemplate.upsert({
      where: { name: 'SMS Work Alert' },
      update: {},
      create: {
        name: 'SMS Work Alert',
        description: 'SMS notification for work blocks',
        type: 'sms',
        body: '🎯 {{blockName}} in {{minutesBefore}} min. Focus time! ({{startTime}} - {{endTime}})',
        isDefault: false
      }
    })

    return { 
      success: true, 
      created: [defaultEmail, defaultSms, emailWorkout, emailWork, smsFitness, smsWork] 
    }
  } catch (e) {
    console.error('Error seeding templates:', e)
    throw new Error('Failed to seed templates')
  }
}
