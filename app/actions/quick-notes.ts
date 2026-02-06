'use server'

import { prisma } from '../../lib/prisma'

export async function getQuickNotes() {
  try {
    const notes = await prisma.quickNote.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    // Filter out notes older than 24 hours
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const validNotes = notes.filter(note => {
      const noteDate = new Date(note.createdAt)
      return noteDate > twentyFourHoursAgo
    })
    
    // Delete expired notes from database
    const expiredIds = notes
      .filter(note => new Date(note.createdAt) <= twentyFourHoursAgo)
      .map(note => note.id)
    
    if (expiredIds.length > 0) {
      await prisma.quickNote.deleteMany({
        where: { id: { in: expiredIds } }
      })
    }
    
    return { notes: validNotes }
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
