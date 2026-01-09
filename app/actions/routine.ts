// Server-side routine actions with database
import { prisma } from '../../lib/prisma'

export type Block = {
  id?: number
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: number[]
  status?: 'upcoming' | 'active' | 'done'
}

function parseHM(hm: string) {
  const [hh, mm] = hm.split(':').map(Number)
  return { hh, mm }
}

function nowHM() {
  const d = new Date()
  return { hh: d.getHours(), mm: d.getMinutes() }
}

function hmToMinutes({ hh, mm }: { hh: number; mm: number }) {
  return hh * 60 + mm
}

function statusForBlock(block: Block, now: { hh: number; mm: number }) {
  const start = hmToMinutes(parseHM(block.start))
  const end = hmToMinutes(parseHM(block.end))
  const n = hmToMinutes(now)
  if (n < start) return 'upcoming' as const
  if (n >= start && n < end) return 'active' as const
  return 'done' as const
}

export async function getTodayRoutine(): Promise<Block[]> {
  try {
    const routines = await prisma.routine.findMany({
      orderBy: {
        start: 'asc',
      },
    })

    const now = nowHM()
    return routines.map((r) => ({
      id: r.id,
      name: r.name,
      start: r.start,
      end: r.end,
      strict: r.strict,
      notifyBefore: r.notifyBefore.split(',').map(Number),
      status: statusForBlock(
        {
          name: r.name,
          start: r.start,
          end: r.end,
          strict: r.strict,
          notifyBefore: r.notifyBefore.split(',').map(Number),
        },
        now
      ),
    }))
  } catch (e) {
    console.error('Error fetching routines:', e)
    return []
  }
}

export async function getUpcomingEvents(): Promise<Block[]> {
  const allEvents = await getTodayRoutine()
  return allEvents.filter((e) => e.status === 'upcoming')
}

export async function getCurrentEvent(): Promise<Block | null> {
  const allEvents = await getTodayRoutine()
  const current = allEvents.find((e) => e.status === 'active')
  return current || null
}

export async function seedRoutine() {
  const defaultRoutine = [
    { name: 'Wake up', start: '09:00', end: '09:15', strict: false, notifyBefore: '15' },
    { name: 'Beach workout', start: '09:15', end: '10:00', strict: false, notifyBefore: '10' },
    { name: 'Shower & Feed', start: '10:00', end: '11:00', strict: false, notifyBefore: '10' },
    { name: 'Morning check-in', start: '11:00', end: '11:15', strict: true, notifyBefore: '10,2' },
    { name: 'Flexible block', start: '11:15', end: '14:30', strict: false, notifyBefore: '30' },
    { name: 'Tennis', start: '15:00', end: '19:00', strict: true, notifyBefore: '30' },
    { name: 'Evening reset', start: '19:00', end: '20:00', strict: false, notifyBefore: '10' },
    { name: 'Meetings', start: '20:00', end: '22:00', strict: true, notifyBefore: '15' },
    { name: 'Wind-down', start: '22:00', end: '23:00', strict: false, notifyBefore: '10' },
    { name: 'Decompression', start: '23:00', end: '00:00', strict: false, notifyBefore: '10' },
    { name: 'Deep Work', start: '00:00', end: '03:00', strict: true, notifyBefore: '0' },
  ]

  for (const routine of defaultRoutine) {
    await prisma.routine.upsert({
      where: { id: defaultRoutine.indexOf(routine) + 1 },
      update: routine,
      create: routine,
    })
  }
}
