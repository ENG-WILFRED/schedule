#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --skip-generate

echo "Seeding database..."
npm run db:seed

echo "Starting application..."
exec npm start
