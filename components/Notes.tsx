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
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Coding Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="
              relative overflow-hidden rounded-2xl p-6
              bg-gradient-to-br from-amber-warning/15 via-slate-900/60 to-slate-800/40
              border-2 border-amber-warning/40
              hover:border-amber-warning/70 hover:shadow-2xl hover:shadow-amber-warning/20
              transition-all duration-300
              group
            "
          >
            <div className="relative">
              <h3 className="font-bold text-white mb-3 text-lg group-hover:text-amber-300 transition-colors">{note.title}</h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                {note.content}
              </p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="
                        px-3 py-1 text-xs font-semibold rounded-full
                        bg-amber-warning/20 text-amber-200 border-2 border-amber-warning/40
                        hover:bg-amber-warning/30 transition-all
                      "
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500 font-semibold">Created {note.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
