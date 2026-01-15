import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const logs = await prisma.dailyLog.findMany({ include: { comments: true }, orderBy: { date: 'desc' } })
    const logsWithNames = logs.map(log => ({ ...log, routineName: `Block ${log.blockId}` }))
    return NextResponse.json({ logs: logsWithNames })
  } catch (err) {
    console.error('API /api/activity GET error', err)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}
