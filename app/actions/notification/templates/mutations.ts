'use server'

import { prisma } from '../../../../lib/prisma'
import { NotificationTemplateInput } from './types'

export async function createTemplate(data: NotificationTemplateInput) {
  try {
    // If this is set as default, unset other defaults of same type
    if (data.isDefault) {
      await prisma.notificationTemplate.updateMany({
        where: { type: data.type, isDefault: true },
        data: { isDefault: false }
      })
    }

    const template = await prisma.notificationTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        subject: data.subject,
        body: data.body,
        keys: data.keys ? JSON.stringify(data.keys) : null,
        isDefault: data.isDefault || false
      },
      include: { preferences: true }
    })
    return { template }
  } catch (e) {
    console.error('Error creating template:', e)
    throw new Error('Failed to create template')
  }
}

export async function updateTemplate(id: number, data: Partial<NotificationTemplateInput>) {
  try {
    // If setting as default, unset other defaults of same type
    if (data.isDefault) {
      const template = await prisma.notificationTemplate.findUnique({ where: { id } })
      if (template) {
        await prisma.notificationTemplate.updateMany({
          where: { type: template.type, isDefault: true, NOT: { id } },
          data: { isDefault: false }
        })
      }
    }

    // Prepare update data
    const updateData: any = { ...data }
    if (data.keys) {
      updateData.keys = JSON.stringify(data.keys)
    }

    const updated = await prisma.notificationTemplate.update({
      where: { id },
      data: updateData,
      include: { preferences: true }
    })
    return { template: updated }
  } catch (e) {
    console.error('Error updating template:', e)
    throw new Error('Failed to update template')
  }
}

export async function deleteTemplate(id: number) {
  try {
    // Check if template is used in any preferences
    const preferences = await prisma.notificationPreference.findMany({
      where: { templateId: id }
    })

    if (preferences.length > 0) {
      throw new Error('Cannot delete template that is in use. Remove it from all preferences first.')
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

export async function duplicateTemplate(id: number, newName: string) {
  try {
    const original = await prisma.notificationTemplate.findUnique({
      where: { id }
    })

    if (!original) {
      throw new Error('Template not found')
    }

    const duplicate = await prisma.notificationTemplate.create({
      data: {
        name: newName,
        description: original.description,
        type: original.type,
        subject: original.subject,
        body: original.body,
        keys: original.keys,
        isDefault: false
      },
      include: { preferences: true }
    })

    return { template: duplicate }
  } catch (e) {
    console.error('Error duplicating template:', e)
    throw new Error('Failed to duplicate template')
  }
}
