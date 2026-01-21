"use client"

import React, { useState } from 'react'
import { showToast } from './ToastContainer'

type CodingPlan = {
  id: number
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  dueDate: string
}

type FormData = {
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
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

const getPlanGradient = (index: number) => {
  const gradients = [
    'from-cyan-500/10 via-slate-900/60 to-slate-800/40 border-cyan-500/30 hover:shadow-cyan-500/10',
    'from-vivid-magenta/10 via-slate-900/60 to-slate-800/40 border-vivid-magenta/30 hover:shadow-vivid-magenta/10',
    'from-neon-green/10 via-slate-900/60 to-slate-800/40 border-neon-green/30 hover:shadow-neon-green/10',
    'from-amber-warning/10 via-slate-900/60 to-slate-800/40 border-amber-warning/30 hover:shadow-amber-warning/10',
  ]
  return gradients[index % gradients.length]
}

export default function CodingPlans({
  plans,
  formData,
  editingPlanId,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
  onFormChange,
  onResetForm,
}: {
  plans: CodingPlan[]
  formData: FormData
  editingPlanId: number | null
  onAddPlan: () => void
  onEditPlan: (plan: CodingPlan) => void
  onDeletePlan: (id: number) => void
  onFormChange: (field: keyof FormData, value: any) => void
  onResetForm: () => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    onResetForm()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    onResetForm()
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      showToast('Please fill all fields', 'error')
      return
    }
    await onAddPlan()
    handleCloseModal()
  }

  return (
    <section className="mb-12">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Coding Plans</h2>
        <button
          onClick={handleOpenModal}
          className="
            w-12 h-12 rounded-full
            bg-gradient-to-r from-cyan-500 to-violet-500
            text-white font-bold text-2xl
            hover:shadow-xl hover:shadow-cyan-500/30
            transition-all duration-300
            flex items-center justify-center
          "
          title="Add new coding plan"
        >
          ＋
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.length === 0 ? (
          <div className="
            col-span-full relative overflow-hidden rounded-2xl p-8 text-center
            bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40
            border border-white/10
          ">
            <p className="text-slate-400">No coding plans yet. Create your first one!</p>
          </div>
        ) : (
          plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`
                relative overflow-hidden rounded-2xl p-6
                bg-gradient-to-br ${getPlanGradient(index)}
                border border-white/10
                hover:border-white/20 hover:shadow-xl
                transition-all duration-300
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
                  <p className="text-sm text-slate-400 mb-3">{plan.description}</p>
                  <p className="text-xs text-slate-500">Due: {plan.dueDate}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onEditPlan(plan)
                      setIsModalOpen(true)
                    }}
                    className="
                      px-4 py-2 rounded-lg font-semibold text-sm
                      bg-cyan-500/20 text-cyan-300 border border-cyan-500/30
                      hover:bg-cyan-500/30 transition-all
                    "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="
                      px-4 py-2 rounded-lg font-semibold text-sm
                      bg-hot-red/20 text-hot-red border border-hot-red/30
                      hover:bg-hot-red/30 transition-all
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="
            relative overflow-hidden rounded-2xl p-8
            bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/85
            border border-white/10
            max-w-2xl w-full shadow-2xl
          ">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingPlanId ? 'Edit Coding Plan' : 'Create New Coding Plan'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Plan Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => onFormChange('title', e.target.value)}
                  placeholder="e.g., Build API Gateway"
                  className="
                    w-full px-4 py-2 rounded-lg
                    bg-slate-800/50 border border-white/10
                    text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
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
                  onChange={(e) => onFormChange('description', e.target.value)}
                  placeholder="Describe what you need to do..."
                  rows={3}
                  className="
                    w-full px-4 py-2 rounded-lg
                    bg-slate-800/50 border border-white/10
                    text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
                    transition-all resize-none
                  "
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => onFormChange('status', e.target.value)}
                    className="
                      w-full px-4 py-2 rounded-lg
                      bg-slate-800/50 border border-white/10
                      text-white
                      focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
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
                    onChange={(e) => onFormChange('dueDate', e.target.value)}
                    className="
                      w-full px-4 py-2 rounded-lg
                      bg-slate-800/50 border border-white/10
                      text-white
                      focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
                      transition-all
                    "
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="
                    flex-1 px-6 py-2 rounded-lg font-semibold
                    bg-gradient-to-r from-cyan-500 to-cyan-400
                    text-base-dark hover:shadow-xl hover:shadow-cyan-500/30
                    transition-all
                  "
                >
                  {editingPlanId ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="
                    px-6 py-2 rounded-lg font-semibold
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
