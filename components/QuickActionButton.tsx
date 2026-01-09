"use client"
import React, { useState } from 'react'

interface QuickActionItem {
  id: number
  name: string
  emoji: string | null
  description: string | null
  color: string
  createdAt?: Date
  updatedAt?: Date
}

export default function QuickActionButton({ 
  action, 
  onExecute,
  count = 0
}: { 
  action: QuickActionItem
  onExecute: (actionId: number) => void
  count?: number
}) {
  const [isAnimating, setIsAnimating] = useState(false)

  const colorMap: Record<string, string> = {
    blue: 'from-primary-blue to-primary-magenta',
    red: 'from-red-accent to-primary-magenta',
    green: 'from-green-light to-green-dark',
    purple: 'from-primary-magenta to-primary-dark',
    pink: 'from-primary-magenta to-yellow-bright',
    yellow: 'from-yellow-bright to-yellow-amber',
    orange: 'from-orange-dark to-red-accent',
  }

  const handleClick = async () => {
    setIsAnimating(true)
    if (action.id) {
      await onExecute(action.id)
    }
    setTimeout(() => setIsAnimating(false), 600)
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-full p-6 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-br ${colorMap[action.color] || colorMap.blue} shadow-2xl hover:brightness-105`}
      style={{
        boxShadow: '0 10px 30px rgba(138,43,226,0.18)'
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className={`text-4xl transition-transform duration-300 ${isAnimating ? 'scale-150' : 'scale-100'}`}>
          {action.emoji || '✨'}
        </span>
        <div>
          <div className="text-sm font-bold">{action.name}</div>
          {action.description && <div className="text-xs opacity-90 line-clamp-1">{action.description}</div>}
        </div>
        {count > 0 && (
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full mt-1">
            {count}x today
          </span>
        )}
      </div>
      {isAnimating && (
        <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></div>
      )}
    </button>
  )
}
