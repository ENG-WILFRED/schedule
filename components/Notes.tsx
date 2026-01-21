"use client"

import React from 'react'

type Note = {
  id: number
  title: string
  content: string
  createdAt: string
  tags?: string[]
}

export default function Notes({ notes }: { notes: Note[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-white">Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="
              relative overflow-hidden rounded-2xl p-6
              bg-gradient-to-br from-amber-warning/10 via-slate-900/60 to-slate-800/40
              border border-amber-warning/30
              hover:border-amber-warning/50 hover:shadow-xl hover:shadow-amber-warning/10
              transition-all duration-300
            "
          >
            <div className="relative">
              <h3 className="font-bold text-white mb-2">{note.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{note.content}</p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="
                        px-2 py-1 text-xs font-semibold rounded-full
                        bg-amber-warning/15 text-amber-warning border border-amber-warning/30
                      "
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500">{note.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
