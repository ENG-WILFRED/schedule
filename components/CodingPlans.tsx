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
    'from-cyan-500/10 via-slate-900/60 to-slate-800/40 border-cyan-500/40 hover:shadow-cyan-500/20',
    'from-vivid-magenta/10 via-slate-900/60 to-slate-800/40 border-vivid-magenta/40 hover:shadow-vivid-magenta/20',
    'from-neon-green/10 via-slate-900/60 to-slate-800/40 border-neon-green/40 hover:shadow-neon-green/20',
    'from-amber-warning/10 via-slate-900/60 to-slate-800/40 border-amber-warning/40 hover:shadow-amber-warning/20',
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
    <section className="mb-12 w-full">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6 w-full">
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
      <div className="grid grid-cols-1 gap-6 w-full">
        {plans.length === 0 ? (
          <div className="
            col-span-full relative overflow-hidden rounded-2xl p-8 text-center
            bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/40
            border-2 border-neon-green/40
          ">
            <p className="text-slate-400">No coding plans yet. Create your first one!</p>
          </div>
        ) : (
          plans.map((plan, index) => {
            const gradientClass = getPlanGradient(index)
            const borderColor = index === 0 ? 'border-cyan-500/60' : 
                               index === 1 ? 'border-vivid-magenta/60' :
                               index === 2 ? 'border-neon-green/60' :
                               'border-amber-warning/60'
            
            return (
            <div
              key={plan.id}
              className={`
                relative overflow-hidden rounded-2xl p-6 w-full
                bg-gradient-to-br ${gradientClass}
                border-2 ${borderColor}
                hover:border-opacity-100 hover:shadow-2xl
                transition-all duration-300
              `}
            >
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-full">
                  <div className="flex flex-col items-center gap-3 mb-2">
                    <h3 className="font-bold text-white text-2xl">{plan.title}</h3>
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
                  <p className="text-xs text-slate-500 mb-4">Due: {plan.dueDate}</p>
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => {
                      onEditPlan(plan)
                      setIsModalOpen(true)
                    }}
                    className="
                      flex-1 px-4 py-2 rounded-lg font-semibold text-sm
                      bg-cyan-500/20 text-cyan-300 border border-cyan-500/30
                      hover:bg-cyan-500/30 transition-all
                    "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="
                      flex-1 px-4 py-2 rounded-lg font-semibold text-sm
                      bg-hot-red/20 text-hot-red border border-hot-red/30
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 w-full">
          <div className="
            relative overflow-hidden rounded-2xl p-8
            bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/85
            border-2 border-cyan-500/40
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
                    bg-slate-800/50 border-2 border-cyan-500/30
                    text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
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
                    bg-slate-800/50 border-2 border-cyan-500/30
                    text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
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
                      bg-slate-800/50 border-2 border-cyan-500/30
                      text-white
                      focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
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
                      bg-slate-800/50 border-2 border-cyan-500/30
                      text-white
                      focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
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
