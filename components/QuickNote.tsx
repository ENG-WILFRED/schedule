"use client"
import React, { useEffect, useState } from 'react'

type QuickNoteProps = {
  readOnly?: boolean
  onAdd?: () => void
}

export default function QuickNote({ readOnly, onAdd }: QuickNoteProps) {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [entries, setEntries] = useState<Array<{ text: string; createdAt: string }>>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quicknotes')
      if (raw) setEntries(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load quicknotes', e)
    }
  }, [])

  function save() {
    if (!text.trim()) return
    const entry = { text: text.trim(), createdAt: new Date().toISOString() }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem('quicknotes', JSON.stringify(updated))
    setText('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClose = () => {
    setIsOpen(false)
    setText('')
  }

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/30 backdrop-blur-xl">
      <div className="flex items-center justify-center mb-6 relative">
        <h3 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">✏️</span> Quick Note
        </h3>
        {!readOnly ? (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute right-0 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all"
          >
            + Add Note
          </button>
        ) : (
          <button
            onClick={() => onAdd && onAdd()}
            className="absolute right-0 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all"
          >
            + Add Note
          </button>
        )}
      </div>

      {entries.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-slate-300 font-semibold">Saved Notes</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {entries.map((e, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 shadow-sm border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors">
                <p className="text-sm text-white font-medium leading-relaxed">{e.text}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(e.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {!readOnly && isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black rounded-2xl border border-white/10 p-6 max-w-xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">New Note</h2>
              <button
                onClick={handleClose}
                className="text-slate-300 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <textarea
              className="w-full min-h-32 bg-white/5 text-white rounded-xl p-4 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none transition-all border border-white/10 backdrop-blur-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Morning check-in, goals, or quick idea..."
              autoFocus
            />

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  save()
                  handleClose()
                }}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  saved
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90'
                }`}
              >
                {saved ? '✓ Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
