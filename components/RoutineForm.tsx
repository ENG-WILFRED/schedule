'use client'
import React, { useState } from 'react'

interface RoutineFormData {
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: string
}

interface Props {
  data: RoutineFormData
  onSubmit: () => void
  onCancel: () => void
  onChange: (data: RoutineFormData) => void
  isEditing: boolean
  isLoading?: boolean
}

export default function RoutineForm({ data, onSubmit, onCancel, onChange, isEditing, isLoading = false }: Props) {
  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">{isEditing ? 'Edit' : 'New'} Routine</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Routine Name"
          value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })}
          disabled={isLoading}
          className="rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none disabled:opacity-50"
        />
        <input
          type="time"
          value={data.start}
          onChange={e => onChange({ ...data, start: e.target.value })}
          disabled={isLoading}
          className="rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none disabled:opacity-50"
        />
        <input
          type="time"
          value={data.end}
          onChange={e => onChange({ ...data, end: e.target.value })}
          disabled={isLoading}
          className="rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none disabled:opacity-50"
        />
        <input
          type="text"
          placeholder="Notify Before (e.g., 15,5)"
          value={data.notifyBefore}
          onChange={e => onChange({ ...data, notifyBefore: e.target.value })}
          disabled={isLoading}
          className="rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white focus:outline-none disabled:opacity-50"
        />
      </div>
      <label className="flex items-center gap-2 mb-4 text-white">
        <input
          type="checkbox"
          checked={data.strict}
          onChange={e => onChange({ ...data, strict: e.target.checked })}
          disabled={isLoading}
          className="w-4 h-4 disabled:opacity-50"
        />
        Strict Routine
      </label>
      <div className="flex gap-3">
        <button 
          onClick={onSubmit} 
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isEditing ? 'Update' : 'Create'}
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
