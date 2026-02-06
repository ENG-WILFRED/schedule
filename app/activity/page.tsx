"use client"
import React, { useState } from 'react'

export default function ActivityPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadActivity = async () => {
    setIsLoading(true)
    try {
      // Simulate loading - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),transparent_45%)] bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <div className="w-full px-4 md:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8">Activity Log</h1>
        <div className="rounded-2xl bg-white/5 p-10 text-center text-slate-400">
          <p className="mb-6">Activity logging coming soon</p>
          <button
            onClick={handleLoadActivity}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isLoading ? 'Loading...' : 'Load Activity'}
          </button>
        </div>
      </div>
    </div>
  )
}
