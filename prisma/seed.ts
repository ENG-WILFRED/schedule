import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTemplates() {
  // Clear existing templates
  await prisma.notificationTemplate.deleteMany({})

  // Create default email template (HTML)
  await prisma.notificationTemplate.create({
    data: {
      name: 'Default Email Notification',
      description: 'Default HTML email template for routine reminders',
      type: 'email',
      subject: '⏰ Reminder: {{routineName}} starting in {{minutesBefore}} minutes',
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; background: #f9f9f9; border-radius: 8px; margin-top: 20px; }
    .time-info { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
    .time-label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .time-value { font-size: 16px; font-weight: bold; color: #333; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ {{routineName}}</h1>
      <p>Starting in {{minutesBefore}} minutes</p>
    </div>
    <div class="content">
      <p>Your routine <strong>"{{routineName}}"</strong> is about to start!</p>
      <div class="time-info">
        <div class="time-label">Start Time</div>
        <div class="time-value">{{startTime}}</div>
      </div>
      <div class="time-info">
        <div class="time-label">End Time</div>
        <div class="time-value">{{endTime}}</div>
      </div>
      <p style="text-align: center; margin-top: 30px; font-size: 14px;">Be ready and make the most of your time! 💪</p>
    </div>
    <div class="footer">
      <p>This is an automated notification from your schedule.</p>
    </div>
  </div>
</body>
</html>`,
      keys: JSON.stringify(['routineName', 'minutesBefore', 'startTime', 'endTime']),
      isDefault: true
    }
  })

  // Create default SMS template
  await prisma.notificationTemplate.create({
    data: {
      name: 'Default SMS Notification',
      description: 'Default SMS template for routine reminders',
      type: 'sms',
      body: '⏰ {{routineName}} starts in {{minutesBefore}} min ({{startTime}}-{{endTime}})',
      keys: JSON.stringify(['routineName', 'minutesBefore', 'startTime', 'endTime']),
      isDefault: true
    }
  })

  // Create specific routine templates
  const routineTemplates = [
    {
      name: 'Wake Up Reminder',
      routineKeyword: 'Wake up',
      subject: '🌅 Good Morning! Time to Wake Up',
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
    .content { padding: 30px; background: #fffbf0; border-radius: 8px; margin-top: 20px; }
    .tip { background: white; padding: 15px; border-left: 4px solid #f5576c; margin: 15px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌅 Good Morning!</h1>
      <p>Time to wake up and start your day</p>
    </div>
    <div class="content">
      <p>Rise and shine! Your day starts at {{startTime}}.</p>
      <div class="tip">
        <strong>💡 Tip:</strong> Drink a glass of water first thing to hydrate your body and boost your energy.
      </div>
      <p style="text-align: center; margin-top: 30px;">Let's have a great day ahead! ✨</p>
    </div>
  </div>
</body>
</html>`
    },
    {
      name: 'Workout Reminder',
      routineKeyword: 'workout',
      subject: '💪 Workout Time! Get Ready',
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #333; padding: 30px; border-radius: 8px; text-align: center; }
    .content { padding: 30px; background: #f0f9ff; border-radius: 8px; margin-top: 20px; }
    .checklist { background: white; padding: 15px; border-left: 4px solid #fa709a; margin: 15px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💪 {{routineName}}</h1>
      <p>Starting in {{minutesBefore}} minutes</p>
    </div>
    <div class="content">
      <p>Get ready for your workout! It starts at {{startTime}} and ends at {{endTime}}.</p>
      <div class="checklist">
        <strong>📋 Pre-workout checklist:</strong>
        <ul>
          <li>Drink water to stay hydrated</li>
          <li>Warm up for 5-10 minutes</li>
          <li>Wear comfortable clothes</li>
          <li>Have your workout plan ready</li>
        </ul>
      </div>
      <p style="text-align: center; margin-top: 30px; font-size: 18px;">You've got this! 🔥</p>
    </div>
  </div>
</body>
</html>`
    },
    {
      name: 'Meeting Reminder',
      routineKeyword: 'Meeting',
      subject: '📅 Meeting Reminder - {{routineName}}',
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
    .content { padding: 30px; background: #f5f3ff; border-radius: 8px; margin-top: 20px; }
    .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
    .info-label { color: #666; font-size: 12px; text-transform: uppercase; }
    .info-value { font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 {{routineName}}</h1>
      <p>Starting in {{minutesBefore}} minutes</p>
    </div>
    <div class="content">
      <p>You have a meeting coming up!</p>
      <div class="info-box">
        <div class="info-label">Start Time</div>
        <div class="info-value">{{startTime}}</div>
      </div>
      <div class="info-box">
        <div class="info-label">End Time</div>
        <div class="info-value">{{endTime}}</div>
      </div>
      <p style="margin-top: 20px;">📝 Prepare yourself by:</p>
      <ul>
        <li>Reviewing your agenda</li>
        <li>Checking any required documents</li>
        <li>Testing your connection/setup</li>
        <li>Clearing distractions</li>
      </ul>
      <p style="text-align: center; margin-top: 30px;">Let's make this meeting productive! 👍</p>
    </div>
  </div>
</body>
</html>`
    },
    {
      name: 'Break Time Reminder',
      routineKeyword: 'break',
      subject: '☕ Time for a Break!',
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; padding: 30px; border-radius: 8px; text-align: center; }
    .content { padding: 30px; background: #f0fef9; border-radius: 8px; margin-top: 20px; }
    .tip { background: white; padding: 15px; border-left: 4px solid #a8edea; margin: 15px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☕ Time for a Break!</h1>
      <p>Take {{minutesBefore}} minutes to recharge</p>
    </div>
    <div class="content">
      <p>You've been working hard. Time to take a well-deserved break!</p>
      <div class="tip">
        <strong>💡 Break ideas:</strong><br>
        Walk around • Stretch • Meditate • Have a snack • Get some fresh air • Relax your eyes
      </div>
      <p style="text-align: center; margin-top: 30px; font-size: 16px;">Take care of yourself! 🌿</p>
    </div>
  </div>
</body>
</html>`
    },
    {
      name: 'Evening Routine Reminder',
      routineKeyword: 'Evening',
      subject: '🌙 Evening Routine Time',
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
    .content { padding: 30px; background: #f5f3ff; border-radius: 8px; margin-top: 20px; }
    .checklist { background: white; padding: 15px; border-left: 4px solid #764ba2; margin: 15px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌙 {{routineName}}</h1>
      <p>Starting at {{startTime}}</p>
    </div>
    <div class="content">
      <p>It's time to wind down and prepare for a good night's sleep.</p>
      <div class="checklist">
        <strong>✓ Evening routine checklist:</strong>
        <ul>
          <li>Review your day and celebrate wins</li>
          <li>Plan tomorrow's priorities</li>
          <li>Reduce screen time</li>
          <li>Prepare your sleep space</li>
          <li>Do some relaxation exercises</li>
        </ul>
      </div>
      <p style="text-align: center; margin-top: 30px;">Sleep well and recharge! 😴</p>
    </div>
  </div>
</body>
</html>`
    },
    {
      name: 'Deep Work Session',
      routineKeyword: 'Deep Work',
      subject: '🎯 Deep Work Session - Focus Time',
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
    .content { padding: 30px; background: #f3f4f6; border-radius: 8px; margin-top: 20px; }
    .prep { background: white; padding: 15px; border-left: 4px solid #1f2937; margin: 15px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Deep Work Session</h1>
      <p>Focus time ahead! {{minutesBefore}} minutes to prepare</p>
    </div>
    <div class="content">
      <p>Time for focused, deep work! {{startTime}} to {{endTime}}.</p>
      <div class="prep">
        <strong>🔧 Prepare your environment:</strong>
        <ul>
          <li>Close all distracting tabs and apps</li>
          <li>Put your phone on silent</li>
          <li>Have water nearby</li>
          <li>Set a clear goal for this session</li>
          <li>Inform others not to disturb you</li>
        </ul>
      </div>
      <p style="text-align: center; margin-top: 30px; font-size: 16px;">Time to achieve great things! 🚀</p>
    </div>
  </div>
</body>
</html>`
    }
  ]

  // Create routine-specific templates
  for (const template of routineTemplates) {
    await prisma.notificationTemplate.create({
      data: {
        name: template.name,
        type: 'email',
        subject: template.subject,
        body: template.body,
        keys: JSON.stringify(['routineName', 'minutesBefore', 'startTime', 'endTime']),
        isDefault: false
      }
    })
  }

  console.log(`✓ Seeded ${2 + routineTemplates.length} notification templates`)
}

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

  // Clear existing routines and preferences
  await prisma.notificationPreference.deleteMany({})
  await prisma.routine.deleteMany({})

  // Template matching logic
  const getTemplateForRoutine = (routineName: string) => {
    const lowerName = routineName.toLowerCase()
    if (lowerName.includes('wake')) return 'Wake Up Reminder'
    if (lowerName.includes('workout') || lowerName.includes('tennis')) return 'Workout Reminder'
    if (lowerName.includes('meeting')) return 'Meeting Reminder'
    if (lowerName.includes('break') || lowerName.includes('flexible')) return 'Break Time Reminder'
    if (lowerName.includes('evening') || lowerName.includes('wind-down') || lowerName.includes('decompression')) return 'Evening Routine Reminder'
    if (lowerName.includes('deep work')) return 'Deep Work Session'
    return 'Default Email Notification'
  }

  // Create routines with notification preferences
  for (const routine of defaultRoutine) {
    const created = await prisma.routine.create({
      data: routine,
    })

    // Get the appropriate template for this routine
    const templateName = getTemplateForRoutine(routine.name)
    const template = await prisma.notificationTemplate.findFirst({
      where: { name: templateName }
    })

    if (template) {
      // Create email notification preference
      await prisma.notificationPreference.create({
        data: {
          routineId: created.id,
          templateId: template.id,
          type: 'email',
          recipient: 'user@example.com', // User can update this in settings
          enabled: true
        }
      })
    }
  }

  console.log(`✓ Seeded ${defaultRoutine.length} routines with notification preferences`)
}

async function seedCodingData() {
  // Clear existing coding data
  await prisma.codingSession.deleteMany({})
  await prisma.codingAchievement.deleteMany({})
  await prisma.codingPlan.deleteMany({})
  await prisma.codingNote.deleteMany({})

  // Seed coding sessions
  const sessions = await Promise.all([
    prisma.codingSession.create({
      data: {
        date: '2026-01-20',
        duration: 120,
        language: 'TypeScript',
      },
    }),
    prisma.codingSession.create({
      data: {
        date: '2026-01-19',
        duration: 95,
        language: 'React',
      },
    }),
    prisma.codingSession.create({
      data: {
        date: '2026-01-18',
        duration: 180,
        language: 'Next.js',
      },
    }),
    prisma.codingSession.create({
      data: {
        date: '2026-01-17',
        duration: 150,
        language: 'TypeScript',
      },
    }),
    prisma.codingSession.create({
      data: {
        date: '2026-01-16',
        duration: 110,
        language: 'Database Design',
      },
    }),
  ])

  // Seed achievements
  const achievements = await Promise.all([
    prisma.codingAchievement.create({
      data: {
        title: '7-Day Streak',
        description: 'Code for 7 consecutive days',
        unlockedAt: new Date('2026-01-15'),
      },
    }),
    prisma.codingAchievement.create({
      data: {
        title: 'Century Coder',
        description: 'Complete 100+ hours of coding',
        unlockedAt: new Date('2026-01-10'),
      },
    }),
    prisma.codingAchievement.create({
      data: {
        title: 'Speed Demon',
        description: 'Code for 3+ hours in a single session',
        unlockedAt: new Date('2026-01-05'),
      },
    }),
  ])

  // Seed coding plans
  const plans = await Promise.all([
    prisma.codingPlan.create({
      data: {
        title: 'Build API Gateway',
        description: 'Create RESTful API with authentication',
        status: 'active',
        dueDate: '2026-02-15',
      },
    }),
    prisma.codingPlan.create({
      data: {
        title: 'Refactor Database Layer',
        description: 'Optimize queries and add indexing',
        status: 'active',
        dueDate: '2026-02-28',
      },
    }),
    prisma.codingPlan.create({
      data: {
        title: 'Add Unit Tests',
        description: 'Achieve 80% code coverage',
        status: 'on-hold',
        dueDate: '2026-03-15',
      },
    }),
  ])

  // Seed notes
  const notes = await Promise.all([
    prisma.codingNote.create({
      data: {
        title: 'TypeScript Tips',
        content: 'Generic types can simplify complex type definitions',
        tags: 'typescript,tips',
      },
    }),
    prisma.codingNote.create({
      data: {
        title: 'Performance Optimization',
        content: 'Consider memoization for expensive computations',
        tags: 'performance,react',
      },
    }),
  ])

  console.log('✅ Coding data seeded:')
  console.log(`  • ${sessions.length} coding sessions`)
  console.log(`  • ${achievements.length} achievements`)
  console.log(`  • ${plans.length} coding plans`)
  console.log(`  • ${notes.length} notes`)
}

async function main() {
  console.log('Starting database seed...')
  
  // Check if templates already exist
  const templateCount = await prisma.notificationTemplate.count()
  if (templateCount === 0) {
    await seedTemplates()
  } else {
    console.log('✓ Templates already exist, skipping template seed')
  }
  
  // Check if routines already exist
  const routineCount = await prisma.routine.count()
  if (routineCount === 0) {
    await seedRoutine()
  } else {
    console.log('✓ Routines already exist, skipping routine seed')
  }
  
  // Check if quick actions already exist
  const quickActionCount = await prisma.quickAction.count()
  if (quickActionCount === 0) {
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
    console.log('✓ Seeded quick actions')
  } else {
    console.log('✓ Quick actions already exist, skipping')
  }

  // Check if notifications already exist
  const notificationCount = await prisma.notification.count()
  if (notificationCount === 0) {
    const today = new Date().toISOString().split('T')[0]
    const routines = await prisma.routine.findMany({ take: 3 })
    for (const r of routines) {
      await prisma.notification.create({ data: { routineId: r.id, minutesBefore: 15, enabled: true } })
      await prisma.notification.create({ data: { routineId: r.id, minutesBefore: 5, enabled: false } })
    }
    console.log('✓ Seeded notifications')
  } else {
    console.log('✓ Notifications already exist, skipping')
  }

  // Check if quick action logs already exist
  const quickActionLogCount = await prisma.quickActionLog.count()
  if (quickActionLogCount === 0) {
    const today = new Date().toISOString().split('T')[0]
    const actions = await prisma.quickAction.findMany()
    if (actions.length > 0) {
      await prisma.quickActionLog.create({ data: { actionId: actions[0].id, date: today, time: '09:05', count: 1 } })
      if (actions[1]) await prisma.quickActionLog.create({ data: { actionId: actions[1].id, date: today, time: '09:20', count: 2 } })
    }
    console.log('✓ Seeded quick action logs')
  } else {
    console.log('✓ Quick action logs already exist, skipping')
  }

  // Check if daily logs already exist
  const dailyLogCount = await prisma.dailyLog.count()
  if (dailyLogCount === 0) {
    const today = new Date().toISOString().split('T')[0]
    const sampleRoutines = await prisma.routine.findMany({ take: 4 })
    for (const r of sampleRoutines) {
      const log = await prisma.dailyLog.create({ data: { date: today, blockId: r.id, status: 'done', notes: `Auto-seeded log for ${r.name}` } })
      await prisma.comment.create({ data: { logId: log.id, text: 'Nice progress today!' } })
    }
    
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
    console.log('✓ Seeded daily logs')
  } else {
    console.log('✓ Daily logs already exist, skipping')
  }

  // Check if weekly stats already exist
  const weeklyStatsCount = await prisma.weeklyStats.count()
  if (weeklyStatsCount === 0) {
    const today = new Date().toISOString().split('T')[0]
    const sampleRoutines = await prisma.routine.findMany({ take: 4 })
    for (const r of sampleRoutines) {
      await prisma.weeklyStats.create({ data: { weekStart: today, routineId: r.id, completed: 3, missed: 1, streakDays: 2 } })
    }
    console.log('✓ Seeded weekly stats')
  } else {
    console.log('✓ Weekly stats already exist, skipping')
  }

  // Seed coding data
  const codingSessionCount = await prisma.codingSession.count()
  if (codingSessionCount === 0) {
    await seedCodingData()
  } else {
    console.log('✓ Coding data already exists, skipping')
  }

  // Seed quick notes
  const quickNoteCount = await prisma.quickNote.count()
  if (quickNoteCount === 0) {
    const sampleQuickNotes = [
      { text: 'Focus on deep work during evening block', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { text: 'Remember to hydrate between routine blocks', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { text: 'Morning workout went great today!', createdAt: new Date() },
    ]
    for (const note of sampleQuickNotes) {
      await prisma.quickNote.create({ data: note })
    }
    console.log(`✓ Seeded ${sampleQuickNotes.length} quick notes`)
  } else {
    console.log('✓ Quick notes already exist, skipping')
  }

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
