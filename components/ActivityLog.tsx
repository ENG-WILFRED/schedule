'use client'
import React from 'react'
import ActivityComments from './ActivityComments'

interface DailyLogEntry {
  id: number
  date: string
  blockId: number
  routineName: string
  status: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
  comments: Array<{ id: number; createdAt: Date; updatedAt: Date; logId: number; text: string; target: string | null; aim: string | null }>
}

interface Props {
  logs: DailyLogEntry[]
  expandedLog: number | null
  onExpandLog: (id: number | null) => void
  onAddComment: (logId: number) => (text: string, target?: string, aim?: string) => Promise<void>
}

export default function ActivityLog({ logs, expandedLog, onExpandLog, onAddComment }: Props) {
  const getStatusStyles = (status: string) => {
    const styles: Record<string, any> = {
      done: { card: 'from-emerald-400/20 to-cyan-400/10 border-emerald-400/30', badge: 'bg-emerald-400/20 text-emerald-300', icon: '✓' },
      active: { card: 'from-fuchsia-500/20 to-violet-500/10 border-fuchsia-500/30', badge: 'bg-fuchsia-500/20 text-fuchsia-300', icon: '⚡' },
      missed: { card: 'from-rose-500/20 to-orange-400/10 border-rose-500/30', badge: 'bg-rose-500/20 text-rose-300', icon: '✗' },
      default: { card: 'from-slate-400/10 to-blue-400/5 border-slate-400/20', badge: 'bg-slate-400/20 text-slate-300', icon: '⏱️' }
    }
    return styles[status] || styles.default
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const logsByDate = logs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = []
    acc[log.date].push(log)
    return acc
  }, {} as Record<string, DailyLogEntry[]>)

  return (
    <div className="space-y-6">
      {Object.entries(logsByDate).map(([date, dateLogs]) => (
        <div key={date}>
          <h2 className="text-lg font-bold text-white mb-4">{formatDate(date)}</h2>
          <div className="space-y-3">
            {dateLogs.map(log => {
              const styles = getStatusStyles(log.status)
              const isExpanded = expandedLog === log.id
              return (
                <div
                  key={log.id}
                  className={`rounded-2xl bg-gradient-to-r ${styles.card} border transition cursor-pointer`}
                  onClick={() => onExpandLog(isExpanded ? null : log.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{styles.icon}</span>
                        <div>
                          <p className="font-semibold text-white">{log.routineName}</p>
                          <p className={`text-xs ${styles.badge} px-2 py-1 rounded-full inline-block`}>
                            {log.status.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-400">{isExpanded ? '▼' : '▶'}</span>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <ActivityComments
                          logId={log.id}
                          comments={log.comments}
                          onAddComment={onAddComment(log.id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
