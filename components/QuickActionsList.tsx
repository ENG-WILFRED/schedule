'use client'
import React from 'react'
import QuickActionButton from './QuickActionButton'

interface QuickAction {
  id: number
  name: string
  emoji: string | null
  description: string | null
  color: string
}

interface ActionLog {
  actionId: number
  count: number
}

interface Props {
  actions: QuickAction[]
  logs: ActionLog[]
  onExecute: (actionId: number) => void
}

export default function QuickActionsList({ actions, logs, onExecute }: Props) {
  const getCount = (actionId: number) => logs.find(l => l.actionId === actionId)?.count || 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {actions.map(action => (
        <QuickActionButton
          key={action.id}
          action={action}
          count={getCount(action.id)}
          onExecute={() => onExecute(action.id)}
        />
      ))}
    </div>
  )
}
