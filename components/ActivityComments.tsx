"use client"
import React, { useState } from 'react'

interface CommentItem {
  id: number
  text: string
  createdAt: Date
  updatedAt: Date
  logId: number
  target: string | null
  aim: string | null
}

export default function ActivityComments({ 
  logId,
  comments = [],
  onAddComment,
  loading = false
}: { 
  logId: number
  comments?: CommentItem[]
  onAddComment: (text: string, target?: string, aim?: string) => Promise<void>
  loading?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [target, setTarget] = useState('')
  const [aim, setAim] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    setSubmitting(true)
    await onAddComment(newComment, target || undefined, aim || undefined)
    setNewComment('')
    setTarget('')
    setAim('')
    setSubmitting(false)
  }

  return (
    <div className="mt-4 pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-primary-magenta hover:text-primary-magenta/80 font-semibold flex items-center gap-2 transition-colors"
      >
        💬 {comments.length} Comments {isOpen ? '▲' : '▼'}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
            <div className="space-y-3 max-h-56 overflow-y-auto p-2 rounded-lg bg-gradient-to-r from-violet-800/6 to-cyan-800/6">
              {comments.length === 0 ? (
                <p className="text-sm text-primary-blue/80 italic">No comments yet</p>
              ) : (
                comments.map((comment, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/6 backdrop-blur-sm">
                    <p className="text-base text-white font-medium leading-relaxed">{comment.text}</p>
                    <div className="mt-2 flex gap-2 items-center text-sm text-white/80">
                      {comment.target && <span className="px-2 py-1 bg-white/10 rounded font-semibold">Target: {comment.target}</span>}
                      {comment.aim && <span className="px-2 py-1 bg-white/10 rounded font-semibold">Aim: {comment.aim}</span>}
                      {comment.createdAt && <span className="ml-auto text-xs text-white/60">{new Date(comment.createdAt).toLocaleString()}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={submitting}
                    placeholder="Target (optional)"
                    className="w-full bg-white-off rounded px-3 py-2 text-sm text-slate-900 placeholder-primary-blue/60 focus:outline-none disabled:opacity-50"
                  />
                  <input
                    type="text"
                    value={aim}
                    onChange={(e) => setAim(e.target.value)}
                    disabled={submitting}
                    placeholder="Aim (optional)"
                    className="w-full bg-white-off rounded px-3 py-2 text-sm text-slate-900 placeholder-primary-blue/60 focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-2 items-start">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submitting}
                    placeholder="Write your comment..."
                    className="flex-1 min-h-[80px] bg-white-off rounded px-3 py-2 text-base text-slate-900 placeholder-primary-blue/60 focus:outline-none disabled:opacity-50"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !newComment.trim()}
                      className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      {submitting && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      {submitting ? '...' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}
