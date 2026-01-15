import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedRoutine() {
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

  // Clear existing routines
  await prisma.routine.deleteMany({})

  // Create new ones
  for (const routine of defaultRoutine) {
    await prisma.routine.create({
      data: routine,
    })
  }

  console.log(`✓ Seeded ${defaultRoutine.length} routines`)
}

async function main() {
  console.log('Starting database seed...')
  await seedRoutine()
  // Seed quick actions
  await prisma.quickAction.deleteMany({})
  const quickActions = [
    { name: 'Water', emoji: '💧', description: 'Drink a glass of water', color: 'blue' },
    { name: 'Stretch', emoji: '🧘', description: 'Short stretch break', color: 'purple' },
    { name: 'Inbox Zero', emoji: '📥', description: 'Quickly triage emails', color: 'green' },
    { name: 'Deep Focus', emoji: '🎧', description: 'Start a focused session', color: 'pink' },
    { name: 'Walk', emoji: '🚶', description: 'Take a short walk', color: 'yellow' },
  ]
  for (const a of quickActions) {
    await prisma.quickAction.create({ data: a })
  }

  // Seed notifications (attach to first two routines if present)
  await prisma.notification.deleteMany({})
  const routines = await prisma.routine.findMany({ take: 3 })
  for (const r of routines) {
    await prisma.notification.create({ data: { routineId: r.id, minutesBefore: 15, enabled: true } })
    await prisma.notification.create({ data: { routineId: r.id, minutesBefore: 5, enabled: false } })
  }

  // Seed quick action logs (today)
  await prisma.quickActionLog.deleteMany({})
  const today = new Date().toISOString().split('T')[0]
  const actions = await prisma.quickAction.findMany()
  if (actions.length > 0) {
    await prisma.quickActionLog.create({ data: { actionId: actions[0].id, date: today, time: '09:05', count: 1 } })
    if (actions[1]) await prisma.quickActionLog.create({ data: { actionId: actions[1].id, date: today, time: '09:20', count: 2 } })
  }

  // Seed a few daily logs and comments
  await prisma.dailyLog.deleteMany({})
  await prisma.comment.deleteMany({})
  const sampleRoutines = await prisma.routine.findMany({ take: 4 })
  for (const r of sampleRoutines) {
    const date = today
    const log = await prisma.dailyLog.create({ data: { date, blockId: r.id, status: 'done', notes: `Auto-seeded log for ${r.name}` } })
    await prisma.comment.create({ data: { logId: log.id, text: 'Nice progress today!' } })
  }

  // Add additional recent daily logs (today, yesterday, 2 days ago)
  const extraDates = [
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    today,
  ]

  const routinesForExtra = await prisma.routine.findMany({ take: 6 })
  for (const d of extraDates) {
    for (let i = 0; i < Math.min(3, routinesForExtra.length); i++) {
      const r = routinesForExtra[i]
      const status = i % 2 === 0 ? 'done' : 'missed'
      const notes = `Auto extra log for ${r.name} on ${d}`
      const log = await prisma.dailyLog.create({ data: { date: d, blockId: r.id, status, notes } })
      if (Math.random() > 0.5) {
        await prisma.comment.create({ data: { logId: log.id, text: 'Auto-generated comment' } })
      }
    }
  }

  // Weekly stats seed
  await prisma.weeklyStats.deleteMany({})
  for (const r of sampleRoutines) {
    await prisma.weeklyStats.create({ data: { weekStart: today, routineId: r.id, completed: 3, missed: 1, streakDays: 2 } })
  }

  // Seed quick notes (stored in localStorage client-side, but we document the structure here)
  const sampleQuickNotes = [
    { text: 'Focus on deep work during evening block', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { text: 'Remember to hydrate between routine blocks', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { text: 'Morning workout went great today!', createdAt: new Date().toISOString() },
  ]
  console.log('Sample Quick Notes (stored in browser localStorage):')
  sampleQuickNotes.forEach(note => console.log(`  • ${note.text} (${new Date(note.createdAt).toLocaleString()})`))

  console.log('Database seed completed!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
