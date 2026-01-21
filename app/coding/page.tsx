"use client"

import React, { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation'
import CodingTimes from '../../components/CodingTimes'
import Achievements from '../../components/Achievements'
import CodingPlans from '../../components/CodingPlans'
import Notes from '../../components/Notes'
import { getCodingPlans, createCodingPlan, updateCodingPlan, deleteCodingPlan } from '../actions/coding-plans'
import { getCodingSessions } from '../actions/coding-sessions'
import { showToast } from '../../components/ToastContainer'

type CodingSession = {
  id: number
  date: string
  duration: number // in minutes
  language: string
}

type Achievement = {
  id: number
  title: string
  description: string
  unlockedAt: string
}

type CodingPlan = {
  id: number
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  dueDate: string
}

type Note = {
  id: number
  title: string
  content: string
  createdAt: string
  tags?: string[]
}

export default function CodingDashboard() {
  const [sessions, setSessions] = useState<CodingSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: '7-Day Streak',
      description: 'Code for 7 consecutive days',
      unlockedAt: '2026-01-15',
    },
    {
      id: 2,
      title: 'Century Coder',
      description: 'Complete 100+ hours of coding',
      unlockedAt: '2026-01-10',
    },
    {
      id: 3,
      title: 'Speed Demon',
      description: 'Code for 3+ hours in a single session',
      unlockedAt: '2026-01-05',
    },
  ])

  const [plans, setPlans] = useState<CodingPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active' as 'active' | 'completed' | 'on-hold',
    dueDate: '',
  })

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'TypeScript Tips',
      content: 'Generic types can simplify complex type definitions',
      createdAt: '2026-01-18',
      tags: ['typescript', 'tips'],
    },
    {
      id: 2,
      title: 'Performance Optimization',
      content: 'Consider memoization for expensive computations',
      createdAt: '2026-01-17',
      tags: ['performance', 'react'],
    },
  ])

  // Load sessions and plans from database on mount
  useEffect(() => {
    loadSessions()
    loadPlans()
  }, [])

  async function loadSessions() {
    try {
      setSessionsLoading(true)
      const { sessions: dbSessions } = await getCodingSessions()
      setSessions(dbSessions)
    } catch (e) {
      console.error(e)
      showToast('Failed to load sessions', 'error')
    } finally {
      setSessionsLoading(false)
    }
  }

  async function loadPlans() {
    try {
      setPlansLoading(true)
      const { plans: dbPlans } = await getCodingPlans()
      const typedPlans = dbPlans.map(p => ({
        ...p,
        status: p.status as 'active' | 'completed' | 'on-hold'
      }))
      setPlans(typedPlans)
    } catch (e) {
      console.error(e)
      showToast('Failed to load plans', 'error')
    } finally {
      setPlansLoading(false)
    }
  }

  const handleAddPlan = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      showToast('Please fill all fields', 'error')
      return
    }

    try {
      if (editingPlanId !== null) {
        // Update existing plan
        const { plan } = await updateCodingPlan(editingPlanId, formData)
        setPlans(plans.map(p => p.id === editingPlanId ? (plan as CodingPlan) : p))
        setEditingPlanId(null)
        showToast('Plan updated', 'success')
      } else {
        // Create new plan
        const { plan } = await createCodingPlan(formData)
        setPlans([plan as CodingPlan, ...plans])
        showToast('Plan created', 'success')
      }
      resetForm()
    } catch (e) {
      console.error(e)
      showToast('Failed to save plan', 'error')
    }
  }

  const handleEditPlan = (plan: CodingPlan) => {
    setEditingPlanId(plan.id)
    setFormData({
      title: plan.title,
      description: plan.description,
      status: plan.status,
      dueDate: plan.dueDate,
    })
  }

  const handleDeletePlan = async (id: number) => {
    try {
      await deleteCodingPlan(id)
      setPlans(plans.filter(p => p.id !== id))
      if (editingPlanId === id) {
        resetForm()
      }
      showToast('Plan deleted', 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to delete plan', 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'active',
      dueDate: '',
    })
    setEditingPlanId(null)
  }

  return (
    <div className="min-h-screen bg-base-dark text-text-primary">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CodingTimes sessions={sessions} />
        <Achievements achievements={achievements} />
        <CodingPlans
          plans={plans}
          formData={formData}
          editingPlanId={editingPlanId}
          onAddPlan={handleAddPlan}
          onEditPlan={handleEditPlan}
          onDeletePlan={handleDeletePlan}
          onFormChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onResetForm={resetForm}
        />
        <Notes notes={notes} />
      </main>
    </div>
  )
}
