"use client"

import React, { useState } from 'react'
import { showToast } from './ToastContainer'

type CodingPlan = {
  id: number
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  startTime: string
  endTime: string
  dueDate: string
}

type FormData = {
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  startTime: string
  endTime: string
  dueDate: string
}

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    case 'completed':
      return 'bg-neon-green/15 text-neon-green border-neon-green/30'
    case 'on-hold':
      return 'bg-amber-warning/15 text-amber-warning border-amber-warning/30'
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30'
  }
}

const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMins] = startTime.split(':').map(Number)
  const [endHours, endMins] = endTime.split(':').map(Number)

  const startTotalMins = startHours * 60 + startMins
  const endTotalMins = endHours * 60 + endMins

  let diff = endTotalMins - startTotalMins
  if (diff < 0) diff += 24 * 60

  return diff
}

const getPlanGradient = (index: number) => {
  const gradients = [
    'from-cyan-500/10 via-slate-900/60 to-slate-800/40 border-cyan-500/40 hover:shadow-cyan-500/20',
    'from-vivid-magenta/10 via-slate-900/60 to-slate-800/40 border-vivid-magenta/40 hover:shadow-vivid-magenta/20',
    'from-neon-green/10 via-slate-900/60 to-slate-800/40 border-neon-green/40 hover:shadow-neon-green/20',
    'from-amber-warning/10 via-slate-900/60 to-slate-800/40 border-amber-warning/40 hover:shadow-amber-warning/20',
  ]
  return gradients[index % gradients.length]
}

export default function CodingTimes({
  plans,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
}: {
  plans: CodingPlan[]
  onAddPlan: (data: FormData) => Promise<void>
  onEditPlan: (plan: CodingPlan) => void
  onDeletePlan: (id: number) => Promise<void>
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    status: 'active',
    startTime: '09:00',
    endTime: '12:00',
    dueDate: new Date().toISOString().split('T')[0],
  })

  const totalMinutes = plans.reduce((acc, p) => acc + calculateDuration(p.startTime, p.endTime), 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10
  const activePlans = plans.filter(p => p.status === 'active').length

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.startTime || !formData.endTime || !formData.dueDate) {
      showToast('Please fill all fields', 'error')
      return
    }
    try {
      await onAddPlan(formData)
      setFormData({
        title: '',
        description: '',
        status: 'active',
        startTime: '09:00',
        endTime: '12:00',
        dueDate: new Date().toISOString().split('T')[0],
      })
      setEditingId(null)
      setIsModalOpen(false)
      showToast(editingId ? 'Plan updated' : 'Plan created', 'success')
    } catch (e) {
      showToast('Failed to save plan', 'error')
    }
  }

  const handleEdit = (plan: CodingPlan) => {
    setEditingId(plan.id)
    setFormData({
      title: plan.title,
      description: plan.description,
      status: plan.status,
      startTime: plan.startTime,
      endTime: plan.endTime,
      dueDate: plan.dueDate,
    })
    setIsModalOpen(true)
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Coding Plans</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="
          relative overflow-hidden rounded-2xl p-6
          bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-800/40
          hover:shadow-xl hover:shadow-cyan-500/20
          transition-all duration-300
        ">
          <div className="relative">
            <p className="text-slate-400 text-sm mb-2">Total Hours</p>
            <p className="text-4xl font-bold text-cyan-300">{totalHours}h</p>
          </div>
        </div>

        <div className="
        relative overflow-hidden rounded-2xl p-6
          bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-800/40
          hover:shadow-xl hover:shadow-cyan-500/20
          transition-all duration-300
        ">
          <div className="relative">
            <p className="text-slate-400 text-sm mb-2">Plans</p>
            <p className="text-4xl font-bold text-neon-green">{plans.length}</p>
          </div>
        </div>

        <div className="
        relative overflow-hidden rounded-2xl p-6
          bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-800/40
          hover:shadow-xl hover:shadow-cyan-500/20
          transition-all duration-300
        ">
          <div className="relative">
            <p className="text-slate-400 text-sm mb-2">Active</p>
            <p className="text-4xl font-bold text-vivid-magenta">{activePlans}</p>
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Your Plans</h3>
        <button
          onClick={() => {
            setEditingId(null)
            setFormData({
              title: '',
              description: '',
              status: 'active',
              startTime: '09:00',
              endTime: '12:00',
              dueDate: new Date().toISOString().split('T')[0],
            })
            setIsModalOpen(true)
          }}
          className="
            w-11 h-11 rounded-full
            bg-gradient-to-r from-cyan-500 to-violet-500
            text-white font-bold text-2xl
            hover:shadow-xl hover:shadow-cyan-500/40
            transition-all duration-300
            flex items-center justify-center
          "
          title="Add new plan"
        >
          +
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p className="text-lg">No coding plans yet. Create your first one!</p>
          </div>
        ) : (
          plans.map((plan, index) => {
            const duration = calculateDuration(plan.startTime, plan.endTime)
            const hours = Math.floor(duration / 60)
            const mins = duration % 60

            return (
              <div
                key={plan.id}
                className={`
                  relative overflow-hidden rounded-2xl p-6
                  bg-gradient-to-br ${getPlanGradient(index)}
                  hover:shadow-2xl
                  transition-all duration-300
                  group
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white text-lg">{plan.title}</h3>
                      <span
                        className={`
                          px-3 py-1 text-xs font-semibold rounded-full
                          border ${getStatusBgColor(plan.status)}
                        `}
                      >
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{plan.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Start</p>
                        <p className="text-lg font-bold text-white">{plan.startTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">End</p>
                        <p className="text-lg font-bold text-white">{plan.endTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Duration</p>
                        <p className="text-lg font-bold text-cyan-300">{hours}h {mins}m</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">Due: {plan.dueDate}</p>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="
                        px-3 py-2 rounded-lg font-semibold text-sm
                        bg-cyan-500/20 text-cyan-300 border border-cyan-500/50
                        hover:bg-cyan-500/30 transition-all
                      "
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="
                        px-3 py-2 rounded-lg font-semibold text-sm
                        bg-hot-red/20 text-hot-red border border-hot-red/50
                        hover:bg-hot-red/30 transition-all
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="
            relative overflow-hidden rounded-2xl p-8
            bg-gradient-to-br from-slate-900/98 via-slate-900/95 to-slate-800/90
            max-w-2xl w-full shadow-2xl
          ">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Edit Coding Plan' : 'Create New Coding Plan'}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Plan Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Build API Gateway"
                  className="
                    w-full px-4 py-3 rounded-lg
                      bg-slate-800/70
                      text-white placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    transition-all
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what you need to do..."
                  rows={3}
                  className="
                    w-full px-4 py-3 rounded-lg
                      bg-slate-800/70
                      text-white placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                    transition-all resize-none
                  "
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="
                      w-full px-3 py-2 rounded-lg
                      bg-slate-800/70
                      text-white
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                      transition-all
                    "
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="
                      w-full px-3 py-2 rounded-lg
                      bg-slate-800/70
                      text-white
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                      transition-all
                    "
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="
                      w-full px-3 py-2 rounded-lg
                      bg-slate-800/70
                      text-white
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                      transition-all
                    "
                  >
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="
                      w-full px-3 py-2 rounded-lg
                      bg-slate-800/70
                      text-white
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                      transition-all
                    "
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={handleSubmit}
                  className="
                    flex-1 px-6 py-3 rounded-lg font-semibold
                    bg-gradient-to-r from-cyan-500 to-cyan-400
                    text-base-dark hover:shadow-xl hover:shadow-cyan-500/40
                    transition-all
                  "
                >
                  {editingId ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="
                    px-6 py-3 rounded-lg font-semibold
                    bg-slate-700 text-slate-300
                    hover:bg-slate-600 transition-all
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
