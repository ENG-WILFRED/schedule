#!/usr/bin/env node

/**
 * Migration helper script (JavaScript)
 * Applies schema changes to database and creates migrations
 * 
 * Usage: node scripts/migrate.js [optional-message]
 * 
 * Examples:
 *   node scripts/migrate.js                    // Apply schema changes
 *   node scripts/migrate.js "remove activity"  // Apply with description
 */

const { execSync } = require('child_process');

const description = process.argv[2] || 'schema changes';

try {
  console.log('🔄 Applying schema changes...');
  console.log(`📝 Description: ${description}`);
  console.log('');

  // Use db push to apply schema changes and create migrations
  const command = `prisma db push --skip-generate`;

  execSync(command, {
    stdio: 'inherit',
    encoding: 'utf-8',
  });

  console.log('');
  console.log('✅ Schema changes applied successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('  - Run: npm run prisma:generate   (to update Prisma Client)');
  console.log('  - Run: npm run db:seed           (if needed)');
  console.log('');
  
  process.exit(0);
} catch (error) {
  console.error('');
  console.error('❌ Failed to apply schema changes');
  console.error('');
  console.error('Troubleshooting:');
  console.error('  - Check DATABASE_URL in .env');
  console.error('  - Verify database connectivity');
  console.error('  - Check schema.prisma for syntax errors');
  process.exit(1);
}
