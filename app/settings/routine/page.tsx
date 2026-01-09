"use client"
import React, { useEffect, useState } from 'react'
import { getAllRoutines, createRoutine, updateRoutine, deleteRoutine } from '../../actions/routines'
import RoutineForm from '../../../components/RoutineForm'
import RoutinesList from '../../../components/RoutinesList'
import { showToast } from '../../../components/ToastContainer'

interface Routine {
  id: number
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: string
}

interface FormData {
  name: string
  start: string
  end: string
  strict: boolean
  notifyBefore: string
}

export default function RoutineSettingsPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '', start: '', end: '', strict: false, notifyBefore: ''
  })

  useEffect(() => {
    loadRoutines()
  }, [])

  const loadRoutines = async () => {
    try {
      setLoading(true)
      const data = await getAllRoutines()
      setRoutines(data.routines || [])
    } catch (e) {
      console.error(e)
      showToast('Failed to load routines', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (routine: Routine) => {
    setFormData(routine)
    setEditingId(routine.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.start || !formData.end) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    try {
      setFormSubmitting(true)
      if (editingId) {
        showToast('Updating routine...', 'loading')
        await updateRoutine(editingId, formData)
        setRoutines(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } : r))
        showToast('Routine updated successfully', 'success')
      } else {
        showToast('Creating routine...', 'loading')
        const data = await createRoutine(formData)
        if (data.routine) setRoutines([...routines, data.routine])
        showToast('Routine created successfully', 'success')
      }
      handleCancel()
    } catch (e) {
      console.error(e)
      showToast('Failed to save routine', 'error')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this routine?')) return
    try {
      await deleteRoutine(id)
      setRoutines(prev => prev.filter(r => r.id !== id))
      showToast('Routine deleted successfully', 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to delete routine', 'error')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', start: '', end: '', strict: false, notifyBefore: '' })
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),transparent_45%)] bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <div className="w-full px-4 md:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white">Routine Management</h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                disabled={formSubmitting}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + New Routine
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-400">Loading routines…</div>
          ) : (
            <>
              {showForm && (
                <RoutineForm
                  data={formData}
                  onChange={setFormData}
                  onSubmit={handleSave}
                  onCancel={handleCancel}
                  isEditing={editingId !== null}
                  isLoading={formSubmitting}
                />
              )}
              <RoutinesList
                routines={routines}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
      </div>
    </div>
  )
}
