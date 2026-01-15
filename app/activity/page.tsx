"use client"
import React, { useEffect, useState } from 'react'
import ActivityLog from '../../components/ActivityLog'
import QuickNote from '../../components/QuickNote'

interface DailyLogEntry {
  id: number
  date: string
  blockId: number
  routineName: string
  status: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
  comments: Array<{ id: number; createdAt: Date; updatedAt: Date; logId: number; text: string; target: string | null; aim: string | null }>
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<DailyLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedLogs, setExpandedLogs] = useState<number[]>([])

  useEffect(() => {
    loadActivity()
  }, [])

  const loadActivity = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/activity')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = (logId: number) => async (text: string, target?: string, aim?: string) => {
    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId, text, target, aim })
      })
      if (!res.ok) throw new Error('Failed to add comment')
      const data = await res.json()
      if (data.comment) {
        setLogs(prev => prev.map(log => (log.id === logId ? { ...log, comments: [...log.comments, data.comment] } : log)))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),transparent_45%)] bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <div className="w-full px-4 md:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8">Activity Log</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          <aside className="lg:sticky lg:top-10 h-fit">
            <QuickNote />
          </aside>

          <main>
            {loading ? (
              <div className="text-center py-16 text-slate-400">Loading activity…</div>
            ) : logs.length === 0 ? (
              <div className="rounded-2xl bg-white/5 p-10 text-center text-slate-400">
                No activity logged yet
              </div>
            ) : (
              <ActivityLog
                logs={logs}
                expandedLogs={expandedLogs}
                onToggleLog={(id: number) =>
                  setExpandedLogs(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
                }
                onAddComment={handleAddComment}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
