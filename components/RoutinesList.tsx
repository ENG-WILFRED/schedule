'use client'
import React, { useState } from 'react'


interface Routine {
  id: number
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: string
}

interface Props {
  routines: Routine[]
  onEdit: (routine: Routine) => void
  onDelete: (id: number) => void
}

export default function RoutinesList({ routines, onEdit, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    setDeletingId(id)
    onDelete(id)
    setTimeout(() => setDeletingId(null), 500)
  }

  if (!routines.length) {
    return (
      <div className="rounded-2xl bg-white/5 p-10 text-center text-slate-400">
        No routines configured yet
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {routines.map(routine => (
        <div
          key={routine.id}
          className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 transition hover:shadow-2xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{routine.name}</h3>
              <p className="text-sm text-slate-400">🕒 {routine.start} – {routine.end}</p>
            </div>
            {routine.strict && (
              <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30">
                Strict
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 mb-4">Notify: {routine.notifyBefore || 'None'}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(routine)}
              className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition text-sm font-semibold"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(routine.id)}
              disabled={deletingId === routine.id}
              className="flex-1 px-3 py-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {deletingId === routine.id ? (
                <>
                  <div className="w-3 h-3 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                '🗑️ Delete'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
