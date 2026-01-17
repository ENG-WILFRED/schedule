#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedTemplates() {
  console.log('Starting database seed...');

  // Clear existing templates
  await prisma.notificationTemplate.deleteMany({});

  // Create default email template
  await prisma.notificationTemplate.create({
    data: {
      name: 'Default Email Notification',
      description: 'Default email template for routine reminders',
      type: 'email',
      subject: 'Reminder: {{routineName}} starting in {{minutesBefore}} minutes',
      body: 'Your routine "{{routineName}}" is starting in {{minutesBefore}} minutes.\n\nStart time: {{startTime}}\nEnd time: {{endTime}}\n\nBe ready!',
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
      body: '{{routineName}} starts in {{minutesBefore}} min. {{startTime}}-{{endTime}}',
      keys: JSON.stringify(['routineName', 'minutesBefore', 'startTime', 'endTime']),
      isDefault: true
    }
  });

  console.log('✓ Seeded notification templates');
}

seedTemplates()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
