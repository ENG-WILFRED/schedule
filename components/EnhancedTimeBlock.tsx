"use client"
import React from 'react'
import type { Block } from '../lib/routine'

function statusClass(s?: Block['status']) {
  if (s === 'active') return 'bg-gradient-to-r from-electric-blue via-cyan-teal to-vivid-magenta text-white shadow-2xl glow-pulse highlight-mix'
  if (s === 'upcoming') return 'bg-electric-blue text-white shadow-md'
  if (s === 'done') return 'bg-amber-warning text-base-dark shadow-md'
  return 'bg-neon-green text-base-dark shadow-md'
}

function statusBadge(s?: Block['status']) {
  if (s === 'active') return <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-electric-blue via-cyan-teal to-vivid-magenta text-white animate-pulse">⚡ Active Now</span>
  if (s === 'upcoming') return <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-electric-blue text-white">⏱️ Upcoming</span>
  return <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-neon-green text-base-dark">✓ Done</span>
}

export default function EnhancedTimeBlock({ block, onClick }: { block: Block; onClick?: () => void }) {
  return (
    <div 
      className={`rounded-lg p-5 transition-all duration-300 cursor-pointer hover:shadow-lg hover:highlight-mix ${statusClass(block.status)}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{block.name}</h3>
          <div className="flex items-center gap-3">
            <p className="text-sm opacity-80">🕐 {block.start} → {block.end}</p>
            {block.strict && <span className="text-xs bg-violet-500/30 px-2 py-1 rounded text-violet-200">Strict</span>}
          </div>
        </div>
        <div className="ml-4 text-right">
          {statusBadge(block.status)}
        </div>
      </div>
      {block.notifyBefore && block.notifyBefore.length > 0 && (
        <div className="mt-3 pt-3">
          <p className="text-xs opacity-75">🔔 Notifications: {block.notifyBefore.join(', ')} min before</p>
        </div>
      )}
    </div>
  )
}
