"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllRoutines } from '../../actions/routines'
import { getNotificationsByRoutineId, createNotification, updateNotification, deleteNotification } from '../../actions/notifications'
import RoutineNotificationsList from '../../../components/RoutineNotificationsList'
import { showToast } from '../../../components/ToastContainer'

interface RoutineBase {
  id: number
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: string
}

interface Routine extends RoutineBase {
  notifications: Array<{ id: number; minutesBefore: number; enabled: boolean; routineId: number }>
}

export default function NotificationsSettingsPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null)
  const [newMinutes, setNewMinutes] = useState(15)

  useEffect(() => {
    loadRoutines()
  }, [])

  const loadRoutines = async () => {
    try {
      setLoading(true)
      const routinesData = await getAllRoutines()
      const enriched = await Promise.all((routinesData.routines || []).map(async (r: RoutineBase) => {
        const notData = await getNotificationsByRoutineId(r.id)
        return { ...r, notifications: notData.notifications || [] } as Routine
      }))
      setRoutines(enriched)
    } catch (e) {
      console.error(e)
      showToast('Failed to load routines', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleNotification = async (routineId: number, notificationId: number, enabled: boolean) => {
    setRoutines(prev => prev.map(r =>
      r.id === routineId
        ? {
          ...r, notifications: r.notifications.map(n =>
            n.id === notificationId ? { ...n, enabled: !n.enabled } : n
          )
        }
        : r
    ))
    try {
      await updateNotification(notificationId, !enabled)
    } catch (e) {
      console.error(e)
      await loadRoutines()
    }
  }

  const handleAddNotification = async (routineId: number) => {
    try {
      const data = await createNotification(routineId, newMinutes)
      if (data.notification) {
        setRoutines(prev => prev.map(r =>
          r.id === routineId
            ? { ...r, notifications: [...r.notifications, data.notification] }
            : r
        ))
      }
      setEditingRoutineId(null)
      setNewMinutes(15)
    } catch (e) {
      console.error(e)
      await loadRoutines()
    }
  }

  const handleDeleteNotification = async (notificationId: number) => {
    setRoutines(prev => prev.map(r => ({
      ...r,
      notifications: r.notifications.filter(n => n.id !== notificationId)
    })))
    try {
      await deleteNotification(notificationId)
      showToast('Notification deleted', 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to delete notification', 'error'
      )
      await loadRoutines()
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),transparent_45%)] bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <div className="w-full px-4 md:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Notification Settings</h1>
          <Link
            href="/settings/notifications/config"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition"
          >
            ⚙️ Settings
          </Link>
        </div>

          {loading ? (
            <div className="text-center py-16 text-slate-400">Loading routines…</div>
          ) : (
            <RoutineNotificationsList
              routines={routines}
              editingRoutineId={editingRoutineId}
              newMinutes={newMinutes}
              onEditRoutine={setEditingRoutineId}
              onToggleNotification={handleToggleNotification}
              onDeleteNotification={handleDeleteNotification}
              onAddNotification={handleAddNotification}
              onMinutesChange={setNewMinutes}
              onCancelEdit={() => setEditingRoutineId(null)}
            />
          )}
      </div>
    </div>
  )
}
