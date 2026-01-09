import React from 'react'
import type { Block } from '../lib/routine'

function statusClass(s?: Block['status']) {
  if (s === 'active') return 'bg-gradient-to-r from-electric-blue via-cyan-teal to-vivid-magenta text-white shadow-2xl glow-pulse highlight-mix'
  if (s === 'upcoming') return 'bg-electric-blue text-white shadow-md'
  if (s === 'done') return 'bg-amber-warning text-base-dark shadow-md'
  return 'bg-neon-green text-base-dark shadow-md'
}

function statusBadge(s?: Block['status']) {
  if (s === 'active') return <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-electric-blue via-cyan-teal to-vivid-magenta text-white animate-pulse">Active Now</span>
  if (s === 'upcoming') return <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-electric-blue text-white">Upcoming</span>
  return <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-neon-green text-base-dark">Done</span>
}

export default function TimeBlock({ block }: { block: Block }) {
  return (
    <div className={`rounded-lg p-4 transition-all duration-300 ${statusClass(block.status)}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">{block.name}</h3>
          <p className="text-sm opacity-75">{block.start} → {block.end}</p>
        </div>
        <div className="ml-4">
          {statusBadge(block.status)}
        </div>
      </div>
      {block.strict && (
        <div className="mt-3 flex items-center text-xs font-medium text-violet-300">
          <span className="inline-block w-2 h-2 rounded-full bg-violet-400 mr-2"></span>
          Strict anchor
        </div>
      )}
    </div>
  )
}
