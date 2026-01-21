"use client"

import React from 'react'

type Achievement = {
  id: number
  title: string
  description: string
  unlockedAt: string
}

export default function Achievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="
              relative overflow-hidden rounded-2xl p-6
              bg-gradient-to-br from-vivid-magenta/10 via-slate-900/60 to-slate-800/40
              border border-vivid-magenta/30
              hover:border-vivid-magenta/50 hover:shadow-xl hover:shadow-vivid-magenta/10
              transition-all duration-300
            "
          >
            <div className="relative">
              <div className="mb-4">
                <span className="
                  text-4xl font-bold bg-gradient-to-r from-vivid-magenta via-cyan-400 to-neon-green 
                  bg-clip-text text-transparent
                ">
                  🏆
                </span>
              </div>
              <h3 className="font-bold text-white mb-2">{achievement.title}</h3>
              <p className="text-sm text-slate-400 mb-3">
                {achievement.description}
              </p>
              <p className="text-xs text-slate-500">
                Unlocked {achievement.unlockedAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
