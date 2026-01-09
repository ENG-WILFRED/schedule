'use client'
import React from 'react'

interface Props {
  actionName: string
  onNameChange: (name: string) => void
  emoji: string
  onEmojiChange: (emoji: string) => void
  description: string
  onDescriptionChange: (desc: string) => void
  color: string
  onColorChange: (color: string) => void
  colors: string[]
  onSubmit: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function QuickActionForm({
  actionName, onNameChange, emoji, onEmojiChange,
  description, onDescriptionChange, color, onColorChange,
  colors, onSubmit, onCancel, isLoading = false
}: Props) {
  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">New Quick Action</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Action Name"
          value={actionName}
          onChange={e => onNameChange(e.target.value)}
          disabled={isLoading}
          className="rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none disabled:opacity-50"
        />
        <input
          type="text"
          placeholder="Emoji"
          value={emoji}
          onChange={e => onEmojiChange(e.target.value)}
          maxLength={2}
          disabled={isLoading}
          className="rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none disabled:opacity-50"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          disabled={isLoading}
          className="rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none lg:col-span-2 disabled:opacity-50"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm text-slate-300 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              disabled={isLoading}
              className={`w-10 h-10 rounded-lg border-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                color === c ? `border-white bg-${c}-500` : `border-${c}-500 bg-${c}-500/30`
              }`}
              title={c}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Create
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
