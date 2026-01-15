import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { logId, text, target, aim } = body
    if (!logId || !text) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const comment = await prisma.comment.create({ data: { logId, text, target, aim } })
    return NextResponse.json({ comment })
  } catch (err) {
    console.error('API /api/comment POST error', err)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
