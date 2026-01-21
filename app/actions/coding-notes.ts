'use server'

import { prisma } from '../../lib/prisma'

export async function getCodingNotes() {
  try {
    const notes = await prisma.codingNote.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return {
      notes: notes.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        tags: n.tags ? n.tags.split(',').map(t => t.trim()) : [],
        createdAt: n.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }))
    }
  } catch (error) {
    console.error('Failed to fetch coding notes:', error)
    throw error
  }
}

export async function createCodingNote(data: {
  title: string
  content: string
  tags?: string
}) {
  try {
    const note = await prisma.codingNote.create({
      data
    })
    return {
      note: {
        id: note.id,
        title: note.title,
        content: note.content,
        tags: note.tags ? note.tags.split(',').map(t => t.trim()) : [],
        createdAt: note.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    }
  } catch (error) {
    console.error('Failed to create coding note:', error)
    throw error
  }
}

export async function deleteCodingNote(id: number) {
  try {
    await prisma.codingNote.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to delete coding note:', error)
    throw error
  }
}
