"use client"

import React from 'react'

type CodingSession = {
  id: number
  date: string
  duration: number
  language: string
}

export default function CodingTimes({ sessions }: { sessions: CodingSession[] }) {
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Coding Times</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="
          relative overflow-hidden rounded-2xl p-6
          bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-800/40
          border border-cyan-500/30
          hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10
          transition-all duration-300
        ">
          <div className="relative">
            <p className="text-slate-400 text-sm mb-2">Total Hours</p>
            <p className="text-4xl font-bold text-cyan-300">{totalHours}h</p>
          </div>
        </div>

        <div className="
          relative overflow-hidden rounded-2xl p-6
          bg-gradient-to-br from-neon-green/10 via-slate-900/60 to-slate-800/40
          border border-neon-green/30
          hover:border-neon-green/50 hover:shadow-xl hover:shadow-neon-green/10
          transition-all duration-300
        ">
          <div className="relative">
            <p className="text-slate-400 text-sm mb-2">Sessions</p>
            <p className="text-4xl font-bold text-neon-green">{sessions.length}</p>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sessions.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-400">
            No coding sessions yet
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="
                relative overflow-hidden rounded-2xl p-4
                bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40
                border border-white/10
                hover:border-white/20 hover:shadow-xl hover:shadow-cyan-500/10
                transition-all duration-300
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{session.language}</h3>
                  <p className="text-sm text-slate-400">{session.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cyan-300">
                    {Math.round((session.duration / 60) * 10) / 10}h
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
