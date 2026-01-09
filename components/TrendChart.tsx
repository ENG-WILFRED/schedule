'use client'
import React from 'react'

interface WeeklyData {
  date: string
  completed: number
  missed: number
  total: number
}

interface TrendData {
  routine: string
  week: WeeklyData[]
  completionRate: number
  streak: number
}

interface Props {
  trends: TrendData[]
}

export default function TrendChart({ trends }: Props) {
  const getDayName = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div className="space-y-10">
      {trends.map((trend, idx) => (
        <div
          key={idx}
          className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 transition hover:shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-8">{trend.routine}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-400/10 p-5 border border-emerald-400/30">
              <p className="text-sm text-emerald-300">Completion Rate</p>
              <p className="text-4xl font-extrabold text-white mt-2">{trend.completionRate}%</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-400/10 p-5 border border-violet-400/30">
              <p className="text-sm text-violet-300">Streak</p>
              <p className="text-4xl font-extrabold text-white mt-2">{trend.streak}</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 p-5 border border-blue-400/30">
              <p className="text-sm text-blue-300">Total Days</p>
              <p className="text-4xl font-extrabold text-white mt-2">7</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-flex gap-3 min-w-full pb-2">
              {trend.week.map((day, i) => (
                <div key={i} className="flex-1 min-w-32 rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
                  <p className="text-xs text-slate-400 mb-2">{getDayName(day.date)}</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-2xl text-emerald-400">✓</span>
                    <span className="text-2xl text-rose-400">✗</span>
                  </div>
                  <p className="text-sm text-white">{day.completed}/{day.total}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
