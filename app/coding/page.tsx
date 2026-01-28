"use client"

import React, { useEffect, useState } from 'react'
import CodingTimes from '../../components/CodingTimes'
import Achievements from '../../components/Achievements'
import Notes from '../../components/Notes'
import { getCodingPlans, createCodingPlan, updateCodingPlan, deleteCodingPlan } from '../actions/coding-plans'
import { getAchievements } from '../actions/achievements'
import { getCodingNotes } from '../actions/coding-notes'
import { showToast } from '../../components/ToastContainer'

type CodingPlan = {
  id: number
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  startTime: string
  endTime: string
  dueDate: string
}

type Achievement = {
  id: number
  title: string
  description: string
  unlockedAt: string
}

type Note = {
  id: number
  title: string
  content: string
  createdAt: string
  tags?: string[]
}

export default function CodingDashboard() {
  const [plans, setPlans] = useState<CodingPlan[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  // Load data from database on mount
  useEffect(() => {
    loadPlans()
    loadAchievements()
    loadNotes()
  }, [])

  async function loadPlans() {
    try {
      const { plans: dbPlans } = await getCodingPlans()
      const typedPlans: CodingPlan[] = dbPlans.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status as 'active' | 'completed' | 'on-hold',
        // ensure UI-friendly strings for times (provide safe defaults)
        startTime: p.startTime ?? '09:00',
        endTime: p.endTime ?? '12:00',
        dueDate: p.dueDate,
      }))
      setPlans(typedPlans)
    } catch (e) {
      console.error(e)
      showToast('Failed to load plans', 'error')
    }
  }

  async function loadAchievements() {
    try {
      const { achievements: dbAchievements } = await getAchievements()
      setAchievements(dbAchievements)
    } catch (e) {
      console.error(e)
      showToast('Failed to load achievements', 'error')
    }
  }

  async function loadNotes() {
    try {
      const { notes: dbNotes } = await getCodingNotes()
      setNotes(dbNotes)
    } catch (e) {
      console.error(e)
      showToast('Failed to load notes', 'error')
    }
  }

  const handleAddPlan = async (data: {
    title: string
    description: string
    status: 'active' | 'completed' | 'on-hold'
    startTime: string
    endTime: string
    dueDate: string
  }) => {
    try {
      const { plan } = await createCodingPlan(data)
      const newPlan: CodingPlan = {
        id: (plan as any).id,
        title: (plan as any).title,
        description: (plan as any).description,
        status: (plan as any).status as 'active' | 'completed' | 'on-hold',
        startTime: (plan as any).startTime ?? data.startTime ?? '09:00',
        endTime: (plan as any).endTime ?? data.endTime ?? '12:00',
        dueDate: (plan as any).dueDate,
      }
      setPlans([newPlan, ...plans])
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const handleEditPlan = async (planId: number, data: {
    title: string
    description: string
    status: 'active' | 'completed' | 'on-hold'
    startTime: string
    endTime: string
    dueDate: string
  }) => {
    try {
      const { plan } = await updateCodingPlan(planId, data)
      const updatedPlan: CodingPlan = {
        id: (plan as any).id,
        title: (plan as any).title,
        description: (plan as any).description,
        status: (plan as any).status as 'active' | 'completed' | 'on-hold',
        startTime: (plan as any).startTime ?? data.startTime ?? '09:00',
        endTime: (plan as any).endTime ?? data.endTime ?? '12:00',
        dueDate: (plan as any).dueDate,
      }
      setPlans(plans.map(p => p.id === planId ? updatedPlan : p))
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const handleDeletePlan = async (id: number) => {
    try {
      await deleteCodingPlan(id)
      setPlans(plans.filter(p => p.id !== id))
      showToast('Plan deleted', 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to delete plan', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-base-dark text-text-primary">
      <main className="w-full">
        <CodingTimes 
          plans={plans}
          onAddPlan={handleAddPlan}
          onEditPlan={(plan) => {
            // This would be used to pre-fill the form
          }}
          onDeletePlan={handleDeletePlan}
        />
        <Achievements achievements={achievements} />
        <Notes notes={notes} />
      </main>
    </div>
  )
}
