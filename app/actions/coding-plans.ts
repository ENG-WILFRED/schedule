'use server'

import { prisma } from '../../lib/prisma'

export async function getCodingPlans() {
  try {
    const plans = await prisma.codingPlan.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { plans }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch coding plans')
  }
}

export async function createCodingPlan(data: {
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  dueDate: string
}) {
  try {
    const plan = await prisma.codingPlan.create({
      data
    })
    return { plan }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create coding plan')
  }
}

export async function updateCodingPlan(
  id: number,
  data: {
    title: string
    description: string
    status: 'active' | 'completed' | 'on-hold'
    dueDate: string
  }
) {
  try {
    const plan = await prisma.codingPlan.update({
      where: { id },
      data
    })
    return { plan }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to update coding plan')
  }
}

export async function deleteCodingPlan(id: number) {
  try {
    await prisma.codingPlan.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete coding plan')
  }
}
