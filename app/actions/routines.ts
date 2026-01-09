'use server'

import { PrismaClient } from '@prisma/client'
import { getTodayRoutine, getUpcomingEvents, getCurrentEvent } from './routine'

const prisma = new PrismaClient()

export async function getAllRoutines() {
  try {
    let routines = await prisma.routine.findMany({
      orderBy: { start: 'asc' }
    })

    if (!routines || routines.length === 0) {
      const defaultRoutine = [
        { name: 'Wake up', start: '07:00', end: '07:15', strict: false, notifyBefore: '15' },
        { name: 'Morning exercise', start: '07:15', end: '08:00', strict: false, notifyBefore: '10' },
        { name: 'Shower & Breakfast', start: '08:00', end: '09:00', strict: false, notifyBefore: '10' },
        { name: 'Work block', start: '09:00', end: '12:00', strict: true, notifyBefore: '15,5' },
        { name: 'Lunch', start: '12:00', end: '13:00', strict: false, notifyBefore: '10' },
        { name: 'Afternoon work', start: '13:00', end: '17:00', strict: true, notifyBefore: '15' },
        { name: 'Evening reset', start: '18:00', end: '19:00', strict: false, notifyBefore: '10' },
        { name: 'Wind-down', start: '21:00', end: '22:00', strict: false, notifyBefore: '10' },
      ]

      for (const r of defaultRoutine) {
        await prisma.routine.create({ data: r })
      }

      routines = await prisma.routine.findMany({ orderBy: { start: 'asc' } })
    }

    return { routines }
  } catch (e) {
    console.error('Error fetching routines:', e)
    throw new Error('Failed to fetch routines')
  }
}

export async function createRoutine(data: { name: string; start: string; end: string; strict?: boolean; notifyBefore?: string }) {
  try {
    const routine = await prisma.routine.create({
      data: {
        name: data.name,
        start: data.start,
        end: data.end,
        strict: data.strict || false,
        notifyBefore: data.notifyBefore || ''
      }
    })
    return { routine }
  } catch (e) {
    console.error('Error creating routine:', e)
    throw new Error('Failed to create routine')
  }
}

export async function updateRoutine(id: number, data: { name: string; start: string; end: string; strict: boolean; notifyBefore: string }) {
  try {
    const routine = await prisma.routine.update({
      where: { id },
      data
    })
    return { routine }
  } catch (e) {
    console.error('Error updating routine:', e)
    throw new Error('Failed to update routine')
  }
}

export async function deleteRoutine(id: number) {
  try {
    await prisma.routine.delete({
      where: { id }
    })
    return { success: true }
  } catch (e) {
    console.error('Error deleting routine:', e)
    throw new Error('Failed to delete routine')
  }
}

export async function getRoutineUpcomingEvents() {
  return getUpcomingEvents()
}

export async function getRoutineCurrentEvent() {
  return getCurrentEvent()
}
