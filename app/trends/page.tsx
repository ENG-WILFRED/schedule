"use client"
import React, { useEffect, useState } from 'react'
import TrendChart from '../../components/TrendChart'
import { getTrendData } from '../actions/trends'

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

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrends()
  }, [])

  const loadTrends = async () => {
    try {
      setLoading(true)
      const data = await getTrendData()
      setTrends(data.trends || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getWeekDate = () => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    return `${monday.toLocaleDateString()} – ${sunday.toLocaleDateString()}`
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),transparent_45%)] bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <div className="w-full px-4 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Routine Trends</h1>
            <p className="text-slate-400 mt-2">Weekly performance and consistency</p>
            <p className="text-sm text-slate-500 mt-1">{getWeekDate()}</p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-400">Loading trends…</div>
          ) : trends.length === 0 ? (
            <div className="rounded-2xl bg-white/5 p-10 text-center text-slate-400">
              No data yet. Start tracking your routines.
            </div>
          ) : (
            <TrendChart trends={trends} />
          )}
      </div>
    </div>
  )
}
