'use server'

import { prisma } from '../../lib/prisma'

export async function getCodingSessions() {
  try {
    const sessions = await prisma.codingSession.findMany({
      orderBy: { date: 'desc' }
    })
    return { sessions }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch coding sessions')
  }
}

export async function createCodingSession(data: {
  date: string
  duration: number
  language: string
}) {
  try {
    const session = await prisma.codingSession.create({
      data
    })
    return { session }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create coding session')
  }
}

export async function deleteCodingSession(id: number) {
  try {
    await prisma.codingSession.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete coding session')
  }
}
