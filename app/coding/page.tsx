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
      {/* Decorative header gradient background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-cyan-500/5 via-vivid-magenta/5 to-transparent pointer-events-none" />
      
      <main className="w-full relative z-10">
        {/* Header Section */}
        <div className="px-6 md:px-12 py-12 md:py-16 border-b border-slate-800/40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-vivid-magenta animate-pulse" />
              <p className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">Coding Dashboard</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-vivid-magenta to-neon-green bg-clip-text text-transparent">
              Level Up Your Skills
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl">
              Track your coding plans, celebrate achievements, and document your learning journey
            </p>
          </div>
        </div>

        {/* Main Content Wrapper */}
        <div className="px-6 md:px-12 py-12 md:py-16">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Coding Times Section */}
            <section className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/10 to-vivid-magenta/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="relative">
                <CodingTimes 
                  plans={plans}
                  onAddPlan={handleAddPlan}
                  onEditPlan={(plan) => {
                    // This would be used to pre-fill the form
                  }}
                  onDeletePlan={handleDeletePlan}
                />
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

            {/* Achievements Section */}
            <section className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-vivid-magenta/10 to-neon-green/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-vivid-magenta/20 to-purple-600/20 border border-vivid-magenta/30">
                    <span className="text-xl">🏆</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Your Achievements</h2>
                </div>
                <Achievements achievements={achievements} />
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

            {/* Notes Section */}
            <section className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-amber-warning/10 to-orange-600/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-warning/20 to-orange-600/20 border border-amber-warning/30">
                    <span className="text-xl">📝</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Coding Notes</h2>
                </div>
                <Notes notes={notes} />
              </div>
            </section>

            {/* Footer spacer */}
            <div className="h-12" />
          </div>
        </div>
      </main>

      {/* Decorative footer gradient */}
      <div className="fixed bottom-0 left-0 w-full h-96 bg-gradient-to-t from-cyan-500/5 via-transparent to-transparent pointer-events-none -z-10" />
    </div>
  )
}
