import React from 'react'

type Props = { dateLabel: string; mainGoal?: string }

export default function TodayHeader({ dateLabel, mainGoal }: Props){
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            {dateLabel}
          </h1>
          <p className="text-lg text-primary-blue/70">
            Focus: <span className="font-semibold text-primary-magenta">{mainGoal || 'Pick one task for deep work'}</span>
          </p>
        </div>
        <div className="text-right text-sm text-primary-blue/70">
          <p className="font-medium text-primary-magenta">Key Anchors</p>
          <p>Wake 09:00 · Tennis 15:00</p>
          <p>Meetings 20:00 · Deep 00:00</p>
        </div>
      </div>
    </div>
  )
}
