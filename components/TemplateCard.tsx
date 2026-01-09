"use client"

import React from 'react'

type Template = {
  id: number
  name: string
  type: 'email' | 'sms'
  subject?: string
  body: string
}

export default function TemplateCard({ t, onCustomize }: { t: Template; onCustomize: (t: Template) => void }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white">{t.name}</h3>
          <p className="text-xs text-slate-400 mt-1 capitalize">{t.type}</p>
        </div>
        {t.subject && <span className="px-2 py-1 text-xs rounded bg-cyan-500/20 text-cyan-300">Email</span>}
      </div>
      {t.subject && (
        <p className="text-sm text-slate-300 mb-2">
          <span className="text-slate-500">Subject:</span> {t.subject}
        </p>
      )}
      <p className="text-sm text-slate-300 line-clamp-2">{t.body}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onCustomize(t)}
          className="px-3 py-1 rounded bg-slate-700 text-white text-sm"
        >
          Customize
        </button>
      </div>
    </div>
  )
}
