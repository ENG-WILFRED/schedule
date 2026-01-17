const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTemplates() {
  console.log('Creating notification templates...');
  
  // Clear in correct order (preferences first due to foreign key)
  await prisma.notificationPreference.deleteMany({});
  await prisma.notificationTemplate.deleteMany({});

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
  });

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
  });

  // Create routine-specific templates
  const templates = [
    {
      name: 'Wake Up Reminder',
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
  ];

  for (const template of templates) {
    await prisma.notificationTemplate.create({
      data: {
        name: template.name,
        type: 'email',
        subject: template.subject,
        body: template.body,
        keys: JSON.stringify(['routineName', 'minutesBefore', 'startTime', 'endTime']),
        isDefault: false
      }
    });
  }

  console.log(`✓ Created ${2 + templates.length} notification templates`);
}

async function seedRoutine() {
  const routines = [
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
  ];

  const getTemplateForRoutine = (routineName) => {
    const lower = routineName.toLowerCase();
    if (lower.includes('wake')) return 'Wake Up Reminder';
    if (lower.includes('workout') || lower.includes('tennis')) return 'Workout Reminder';
    if (lower.includes('meeting')) return 'Meeting Reminder';
    if (lower.includes('break') || lower.includes('flexible')) return 'Break Time Reminder';
    if (lower.includes('evening') || lower.includes('wind-down') || lower.includes('decompression')) return 'Evening Routine Reminder';
    if (lower.includes('deep work')) return 'Deep Work Session';
    return 'Default Email Notification';
  };

  console.log('Creating routines with notification preferences...');
  
  for (const routine of routines) {
    const created = await prisma.routine.create({
      data: routine
    });

    const templateName = getTemplateForRoutine(routine.name);
    const template = await prisma.notificationTemplate.findFirst({
      where: { name: templateName }
    });

    if (template) {
      await prisma.notificationPreference.create({
        data: {
          routineId: created.id,
          templateId: template.id,
          type: 'email',
          recipient: 'user@example.com',
          enabled: true
        }
      });
    }
  }

  console.log(`✓ Created ${routines.length} routines with notification preferences`);
}

async function main() {
  try {
    console.log('Starting database seed...\n');
    await seedTemplates();
    await seedRoutine();
    console.log('\n✅ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
