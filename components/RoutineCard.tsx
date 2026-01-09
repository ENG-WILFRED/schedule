"use client"

import React, { useState } from 'react'

type Routine = { id: number; name: string; start: string; end: string; strict: boolean }
type Pref = { id: number; routineId: number; type: 'email' | 'sms'; templateId: number | null; enabled: boolean; template?: { name: string } }

export default function RoutineCard({
  routine,
  emailPref,
  smsPref,
  onToggle
}: {
  routine: Routine
  emailPref?: Pref
  smsPref?: Pref
  onToggle: (routineId: number, type: 'email' | 'sms') => Promise<void>
}) {
  return (
    <div className="
      relative overflow-hidden rounded-2xl p-6
      bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40
      border border-white/10
      hover:border-white/20 hover:shadow-xl hover:shadow-cyan-500/10
      transition-all duration-300
    ">
      {/* subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {routine.name}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {routine.start} – {routine.end}
          </p>
        </div>

        {routine.strict && (
          <span className="
            px-3 py-1 text-xs font-semibold rounded-full
            bg-rose-500/15 text-rose-300 border border-rose-500/30
          ">
            Strict
          </span>
        )}
      </div>

      {/* Email Section */}
      <Section
        icon="📧"
        title="Email Notification"
        accent="indigo"
        enabled={emailPref?.enabled}
        recipient="kimaniwilfred95@gmail.com"
        templateType="email"
        routineId={routine.id}
        pref={emailPref}
        onToggle={onToggle}
      />

      {/* SMS Section */}
      <Section
        icon="💬"
        title="SMS Notification"
        accent="emerald"
        enabled={smsPref?.enabled}
        recipient="0793056960"
        templateType="sms"
        routineId={routine.id}
        pref={smsPref}
        onToggle={onToggle}
      />
    </div>
  )
}

/* ---------- Sub component ---------- */

function Section({
  icon,
  title,
  accent,
  enabled,
  recipient,
  templateType,
  routineId,
  pref,
  onToggle
}: {
  icon: string
  title: string
  accent: 'indigo' | 'emerald'
  enabled?: boolean
  recipient: string
  templateType: 'email' | 'sms'
  routineId: number
  pref?: Pref
  onToggle: (routineId: number, type: 'email' | 'sms') => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const accentMap: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-indigo-400/5',
    emerald: 'from-emerald-500/20 to-emerald-400/5'
  }

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-white flex items-center gap-2">
          <span>{icon}</span> {title}
        </span>

        {pref && (
          <button
            onClick={async () => {
              setLoading(true)
              try {
                await onToggle(routineId, templateType)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className={`
              px-3 py-1 rounded-full text-xs font-semibold
              border transition
              ${loading ? 'opacity-60 cursor-not-allowed' : ''}
              ${enabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-700/30 text-slate-300 border-slate-600/40'}
            `}
          >
            {loading ? '⟳ Loading...' : enabled ? 'Enabled' : 'Disabled'}
          </button>
        )}
      </div>

      <div className={`
        rounded-xl p-4
        bg-gradient-to-br ${accentMap[accent]}
        border border-white/10
      `}>
        <div className="text-sm text-slate-300 mb-3">
          Recipient: <span className="text-white font-medium">{recipient}</span>
        </div>

        {pref?.template && (
          <div className="text-sm text-slate-300 mb-3">
            Template: <span className="text-white font-medium">{pref.template.name}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 items-center">
          <a
            href="/settings/notifications/templates"
            className="
              px-4 py-2 rounded-lg
              bg-white/10 hover:bg-white/20
              text-white font-semibold
              transition
            "
          >
            Manage Templates →
          </a>

          <button
            onClick={async () => {
              setLoading(true)
              try {
                await onToggle(routineId, templateType)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="
              px-4 py-2 rounded-lg
              bg-slate-700/50 hover:bg-slate-700
              text-white font-semibold
              transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? '⟳ Loading...' : enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  )
}
