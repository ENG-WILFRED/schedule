'use server'

import { prisma } from '../../lib/prisma'

export async function getQuickNotes() {
  try {
    const notes = await prisma.quickNote.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { notes }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch quick notes')
  }
}

export async function createQuickNote(text: string) {
  try {
    const note = await prisma.quickNote.create({
      data: { text }
    })
    return { note }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create quick note')
  }
}

export async function deleteQuickNote(id: number) {
  try {
    await prisma.quickNote.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete quick note')
  }
}
