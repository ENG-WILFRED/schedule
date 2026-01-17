"use client"
import React, { useEffect, useState } from 'react'
import TodayHeader from '../components/TodayHeader'
import EnhancedTimeBlock from '../components/EnhancedTimeBlock'
import QuickNote from '../components/QuickNote'
import { useRouter } from 'next/navigation'
import { getAllRoutines } from './actions/routines'
import { getAllRoutinesWithTemplateData } from './actions/routine-template-data'
import { showToast } from '../components/ToastContainer'


type Block = {
  id?: number
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: number[]
  status?: 'upcoming' | 'active' | 'done'
  templateData?: any // Include template variables from database
}

export default function Page() {
  const router = useRouter()
  const [routine, setRoutine] = useState<Block[]>([])
  const [upcoming, setUpcoming] = useState<Block[]>([])
  const [current, setCurrent] = useState<Block | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        // Fetch routines with template data for notifications
        const templateData = await getAllRoutinesWithTemplateData()
        const routinesArray = templateData || []

        function parseHM(hm: string) {
          const [hh, mm] = hm.split(':').map(Number)
          return { hh, mm }
        }

        function nowHM() {
          const d = new Date()
          return { hh: d.getHours(), mm: d.getMinutes() }
        }

        function hmToMinutes({ hh, mm }: { hh: number; mm: number }) {
          return hh * 60 + mm
        }

        function statusForBlock(block: Block, now: { hh: number; mm: number }) {
          const start = hmToMinutes(parseHM(block.start))
          const end = hmToMinutes(parseHM(block.end))
          const n = hmToMinutes(now)
          if (n < start) return 'upcoming' as const
          if (n >= start && n < end) return 'active' as const
          return 'done' as const
        }

        const now = nowHM()
        const mapped = routinesArray.map((r: any) => ({
          id: r.id,
          name: r.name,
          start: r.start,
          end: r.end,
          strict: r.strict,
          notifyBefore: (r.notifyBefore || '').toString().split(',').filter(Boolean).map(Number),
          status: statusForBlock(r as Block, now),
          templateData: r, // Include full template data for notifications
        }))

        setRoutine(mapped)
        setUpcoming(mapped.filter((e: Block) => e.status === 'upcoming'))
        setCurrent(mapped.find((e: Block) => e.status === 'active') || null)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),transparent_45%)] bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <div className="w-full px-4 md:px-8 py-10">
        <TodayHeader
          dateLabel={dateLabel}
          mainGoal="Stay on track with your routine"
        />

        {/* Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-8 mt-8">
          {/* Main */}
          <div className="space-y-8">
            {/* Current Block */}
            {current ? (
              <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-fuchsia-600/20 via-violet-600/20 to-cyan-500/20 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 blur-2xl" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-widest text-fuchsia-300 font-semibold mb-2">
                    🎯 Active Now
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    {current.name}
                  </h2>
                  <p className="text-lg text-cyan-300 mb-4">
                    {current.start} → {current.end}
                  </p>
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400" />
                  <p className="text-sm text-slate-300 mt-4">
                    Stay focused — this block matters 💪
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center text-slate-300">
                No active block right now. Take a breath ☕
              </div>
            )}

            {/* Next Up */}
            {upcoming.length > 0 && (
              <section>
                <h3 className="text-xl md:text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-3">
                  <span className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-violet-600" />
                  Next Up
                </h3>
                <div className="space-y-3">
                  {upcoming.slice(0, 3).map((b, idx) => (
                    <EnhancedTimeBlock key={idx} block={b} onClick={() => {}} />
                  ))}
                </div>
              </section>
            )}

            {/* Full Routine */}
            <section>
              <h3 className="text-xl md:text-2xl font-bold text-violet-300 mb-2 flex items-center gap-3">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-cyan-600" />
                Today’s Routine
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {routine.length} blocks scheduled
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {loading && (
                  <div className="rounded-lg bg-white/5 p-4 text-center text-slate-300">
                    ⟳ Loading…
                  </div>
                )}
                {!loading && routine.length === 0 && (
                  <div className="rounded-lg bg-white/5 p-4 text-center text-slate-300">
                    No routines scheduled today
                  </div>
                )}
                {!loading &&
                  routine.map((b, idx) => (
                    <EnhancedTimeBlock
                      key={idx}
                      block={b}
                      onClick={() => {}}
                    />
                  ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Incoming Reminders */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <h3 className="text-white font-bold mb-4">🔔 Incoming Reminders</h3>
              <div className="space-y-3">
                {upcoming.length === 0 && (
                  <p className="text-slate-300 text-sm">No upcoming reminders</p>
                )}
                {upcoming.slice(0, 3).map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/6">
                    <div>
                      <p className="text-sm text-white font-medium">{u.name}</p>
                      <p className="text-xs text-slate-400">Starts at {u.start}</p>
                    </div>
                    <div className="text-xs text-slate-300">{u.start}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <h3 className="text-white font-bold mb-4">⚡ Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    showToast('Navigating to Activity...', 'loading')
                    router.push('/activity')
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 text-fuchsia-300 font-semibold hover:brightness-110 transition disabled:opacity-50"
                >
                  📝 Activity Log
                </button>
                <button
                  onClick={() => {
                    showToast('Navigating to Notifications...', 'loading')
                    router.push('/settings/notifications')
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-400/20 to-rose-500/20 text-orange-300 font-semibold hover:brightness-110 transition disabled:opacity-50"
                >
                  🔔 Notifications
                </button>
              </div>
            </div>

            {/* Quick Notes (read-only) */}
            <QuickNote
              readOnly
              onAdd={() => {
                showToast('Navigating to Activity...', 'loading')
                router.push('/activity')
              }}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
