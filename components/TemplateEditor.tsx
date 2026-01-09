"use client"

import React, { useState } from 'react'

type Props = {
  id: number
  initialSubject?: string
  initialBody: string
  onCancel: () => void
  onSave: (id: number, subject: string, body: string) => Promise<void>
}

export default function TemplateEditor({ id, initialSubject, initialBody, onCancel, onSave }: Props) {
  const [subject, setSubject] = useState(initialSubject || '')
  const [body, setBody] = useState(initialBody || '')
  const [loading, setLoading] = useState(false)

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Customize Template</h3>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-3 py-1 rounded bg-slate-700 text-white">Cancel</button>
          <button
            onClick={async () => {
              setLoading(true)
              await onSave(id, subject, body)
              setLoading(false)
            }}
            className="px-3 py-1 rounded bg-cyan-600 text-white"
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">Subject (emails only)</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 text-white mb-4" />

        <label className="block text-sm text-slate-400 mb-2">Body</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full px-3 py-2 rounded bg-slate-900 text-white" />
      </div>
    </div>
  )
}
