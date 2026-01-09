'use client'
import React, { useState } from 'react'
import NotificationItem from './NotificationItem'

interface Routine {
  id: number
  name: string
  start: string
  end: string
  strict: boolean
  notifications: Array<{ id: number; minutesBefore: number; enabled: boolean; routineId: number }>
}

interface Props {
  routines: Routine[]
  editingRoutineId: number | null
  newMinutes: number
  onEditRoutine: (id: number) => void
  onToggleNotification: (routineId: number, notificationId: number, enabled: boolean) => void
  onDeleteNotification: (notificationId: number) => void
  onAddNotification: (routineId: number) => void
  onMinutesChange: (minutes: number) => void
  onCancelEdit: () => void
}

export default function RoutineNotificationsList({
  routines,
  editingRoutineId,
  newMinutes,
  onEditRoutine,
  onToggleNotification,
  onDeleteNotification,
  onAddNotification,
  onMinutesChange,
  onCancelEdit
}: Props) {
  const [addingId, setAddingId] = useState<number | null>(null)

  const handleAddNotification = async (routineId: number) => {
    setAddingId(routineId)
    await onAddNotification(routineId)
    setAddingId(null)
  }

  if (!routines.length) {
    return (
      <div className="rounded-2xl bg-white/5 p-10 text-center text-slate-400">
        No routines available
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {routines.map(routine => (
        <div
          key={routine.id}
          className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 transition hover:shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{routine.name}</h2>
              <p className="text-sm text-slate-400">🕒 {routine.start} – {routine.end}</p>
            </div>
            {routine.strict && (
              <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30">
                Strict Routine
              </span>
            )}
          </div>

          <div className="space-y-3 mb-4">
            {routine.notifications.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No notifications configured</p>
            ) : (
              routine.notifications.map(notif => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onToggle={(id, enabled) => onToggleNotification(routine.id, id, enabled)}
                  onDelete={onDeleteNotification}
                />
              ))
            )}
          </div>

          {editingRoutineId === routine.id ? (
            <div className="flex flex-wrap gap-3 mt-4">
              <input
                type="number"
                min="1"
                value={newMinutes}
                onChange={e => onMinutesChange(parseInt(e.target.value) || 15)}
                disabled={addingId === routine.id}
                className="w-28 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white focus:outline-none disabled:opacity-50"
              />
              <span className="text-slate-400 py-2">minutes before</span>
              <button
                onClick={() => handleAddNotification(routine.id)}
                disabled={addingId === routine.id}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addingId === routine.id && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {addingId === routine.id ? 'Adding...' : 'Add'}
              </button>
              <button
                onClick={onCancelEdit}
                disabled={addingId === routine.id}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => onEditRoutine(routine.id)}
              className="text-sm text-slate-300 hover:text-white mt-2 transition"
            >
              + Add notification
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
