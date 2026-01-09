"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllRoutines } from '../../../actions/routines'
import { getAllPreferences, togglePreference } from '../../../actions/notification/preference'
import { showToast } from '../../../../components/ToastContainer'
import RoutineCard from '../../../../components/RoutineCard'

type Routine = {
  id: number
  name: string
  start: string
  end: string
  strict: boolean
}

type Preference = {
  id: number
  routineId: number
  type: 'email' | 'sms'
  recipient: string
  templateId: number
  enabled: boolean
  template: { name: string }
}

export default function NotificationConfigPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [preferences, setPreferences] = useState<Preference[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      const [routineData, prefData] = await Promise.all([
        getAllRoutines(),
        getAllPreferences()
      ])

      setRoutines((routineData as any).routines || [])
      setPreferences((prefData as any).preferences || [])
    } catch (e) {
      console.error(e)
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(routineId: number, type: 'email' | 'sms') {
    try {
      await togglePreference(routineId, type)
      showToast(`${type} notification toggled`, 'success')
      load()
    } catch (e) {
      showToast('Failed to toggle preference', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black px-4 py-10 w-full">
        <div className="w-full">
          <p className="text-center text-slate-300">⟳ Loading notification settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black px-4 py-10 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/settings/notifications"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
          >
            ← Back
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Routine Notifications</h1>
            <p className="text-slate-400 text-sm mt-1">Configure which routines send email or SMS notifications</p>
          </div>
          <Link
            href="/settings/notifications/templates"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
          >
            Manage Templates
          </Link>
        </div>

        {/* Preferences Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <h2 className="text-2xl font-bold text-cyan-300 mb-0 text-center lg:col-span-2">Routine Notifications</h2>

          {routines.map((routine) => {
            const routinePrefs = preferences.filter((p) => p.routineId === routine.id)
            const emailPref = routinePrefs.find((p) => p.type === 'email')
            const smsPref = routinePrefs.find((p) => p.type === 'sms')

            return (
              <RoutineCard
                key={routine.id}
                routine={routine}
                emailPref={emailPref as any}
                smsPref={smsPref as any}
                onToggle={handleToggle}
              />
            )
          })}

          {routines.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>No routines configured yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

