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
              bg-gradient-to-br from-vivid-magenta/15 via-slate-900/60 to-slate-800/40
              hover:shadow-2xl hover:shadow-vivid-magenta/20
              transition-all duration-300
              group
            "
          >
            <div className="relative">
              <div className="mb-4">
                <span className="
                  text-5xl font-bold bg-gradient-to-r from-vivid-magenta via-cyan-400 to-neon-green 
                  bg-clip-text text-transparent
                  group-hover:scale-110 transition-transform duration-300 inline-block
                ">
                  🏆
                </span>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">{achievement.title}</h3>
              <p className="text-sm text-slate-400 mb-4">
                {achievement.description}
              </p>
              <p className="text-xs text-slate-500 font-semibold">
                Unlocked {achievement.unlockedAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
