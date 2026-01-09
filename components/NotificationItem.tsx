'use client'
import React, { useState } from 'react'

interface Notification {
  id: number
  minutesBefore: number
  enabled: boolean
  routineId: number
}

interface Props {
  notification: Notification
  onToggle: (notificationId: number, enabled: boolean) => void
  onDelete: (notificationId: number) => void
}

export default function NotificationItem({ notification, onToggle, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = () => {
    setDeleting(true)
    onDelete(notification.id)
    setTimeout(() => setDeleting(false), 500)
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-white/10 border border-white/10 px-4 py-3">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(notification.id, notification.enabled)}
          className={`w-6 h-6 rounded-md border flex items-center justify-center transition
            ${notification.enabled
              ? 'bg-emerald-400/80 border-emerald-400 text-black'
              : 'border-slate-500 hover:border-slate-300'
            }
          `}
        >
          {notification.enabled && '✓'}
        </button>
        <span className="text-white font-medium">
          🔔 {notification.minutesBefore} minutes before
        </span>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-rose-400 hover:text-rose-300 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      >
        {deleting ? (
          <>
            <div className="w-3 h-3 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
            Removing...
          </>
        ) : (
          'Remove'
        )}
      </button>
    </div>
  )
}
