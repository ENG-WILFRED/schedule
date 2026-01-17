'use server'

import { prisma } from '../../../../lib/prisma'

export async function getTemplate(id: number) {
  try {
    const template = await prisma.notificationTemplate.findUnique({
      where: { id },
      include: { preferences: true }
    })
    return { template }
  } catch (e) {
    console.error('Error fetching template:', e)
    throw new Error('Failed to fetch template')
  }
}

export async function getTemplateByName(name: string) {
  try {
    const template = await prisma.notificationTemplate.findUnique({
      where: { name },
      include: { preferences: true }
    })
    return { template }
  } catch (e) {
    console.error('Error fetching template:', e)
    throw new Error('Failed to fetch template')
  }
}

export async function getTemplatesByType(type: 'email' | 'sms') {
  try {
    const templates = await prisma.notificationTemplate.findMany({
      where: { type },
      include: { preferences: true },
      orderBy: { createdAt: 'desc' }
    })
    return { templates }
  } catch (e) {
    console.error('Error fetching templates:', e)
    throw new Error('Failed to fetch templates')
  }
}

export async function getAllTemplates() {
  try {
    const templates = await prisma.notificationTemplate.findMany({
      include: { preferences: true },
      orderBy: { createdAt: 'desc' }
    })
    return { templates }
  } catch (e) {
    console.error('Error fetching all templates:', e)
    throw new Error('Failed to fetch templates')
  }
}

// Alias for compatibility
export async function getTemplates() {
  return getAllTemplates()
}

export async function getDefaultTemplate(type: 'email' | 'sms') {
  try {
    const template = await prisma.notificationTemplate.findFirst({
      where: { type, isDefault: true },
      include: { preferences: true }
    })
    return { template }
  } catch (e) {
    console.error('Error fetching default template:', e)
    throw new Error('Failed to fetch default template')
  }
}
