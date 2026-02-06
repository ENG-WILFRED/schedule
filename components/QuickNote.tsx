"use client"
import React, { useEffect, useState } from 'react'
import { getQuickNotes, createQuickNote, deleteQuickNote } from '../app/actions/quick-notes'
import { showToast } from './ToastContainer'

type QuickNoteProps = {
  readOnly?: boolean
  onAdd?: () => void
}

type QuickNoteEntry = {
  id: number
  text: string
  createdAt: Date | string
}

export default function QuickNote({ readOnly, onAdd }: QuickNoteProps) {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [entries, setEntries] = useState<QuickNoteEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    try {
      setLoading(true)
      const { notes } = await getQuickNotes()
      setEntries(notes)
    } catch (e) {
      console.error('Failed to load quick notes', e)
      showToast('Failed to load notes', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    if (!text.trim()) return
    try {
      const { note } = await createQuickNote(text.trim())
      setEntries([note as QuickNoteEntry, ...entries])
      setText('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      showToast('Note saved', 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to save note', 'error')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteQuickNote(id)
      setEntries(entries.filter(e => e.id !== id))
      showToast('Note deleted', 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to delete note', 'error')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setText('')
  }

  const getTimeUntilExpiry = (createdAt: Date | string) => {
    const created = new Date(createdAt)
    const expiresAt = new Date(created.getTime() + 24 * 60 * 60 * 1000)
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (60 * 60 * 1000))
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
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
            aria-label="Add note"
            title="Add note"
            className="absolute right-0 w-10 h-10 grid place-items-center rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all"
          >
            <span className="text-xl">＋</span>
          </button>
        ) : (
          <button
            onClick={() => onAdd && onAdd()}
            aria-label="Add note"
            title="Add note"
            className="absolute right-0 w-10 h-10 grid place-items-center rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-all"
          >
            <span className="text-xl">＋</span>
          </button>
        )}
      </div>

      {entries.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-slate-300 font-semibold">Saved Notes (Expire in 24h)</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {entries.map((e) => (
              <div key={e.id} className="p-3 rounded-xl bg-white/5 shadow-sm border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors group">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-white font-medium leading-relaxed flex-1">{e.text}</p>
                  {!readOnly && (
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-xs text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete note"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">
                    {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-cyan-400 font-semibold">
                    {getTimeUntilExpiry(e.createdAt)}
                  </p>
                </div>
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
