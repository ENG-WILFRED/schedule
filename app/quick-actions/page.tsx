"use client"
import React, { useEffect, useState } from 'react'
import { getQuickActions, createQuickAction, getQuickActionLogs, createQuickActionLog } from '../actions/quickactions'
import QuickActionForm from '../../components/QuickActionForm'
import QuickActionsList from '../../components/QuickActionsList'
import { showToast } from '../../components/ToastContainer'

interface QuickAction { id: number; name: string; emoji: string | null; description: string | null; color: string }
interface ActionLog { actionId: number; count: number }

export default function QuickActionsPage() {
  const [actions, setActions] = useState<QuickAction[]>([])
  const [logs, setLogs] = useState<ActionLog[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newAction, setNewAction] = useState({ name: '', emoji: '✨', description: '', color: 'blue' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const colors = ['blue', 'red', 'green', 'purple', 'orange', 'indigo']

  useEffect(() => { loadActions() }, [])

  const loadActions = async () => {
    try {
      setLoading(true)
      const [actionsData, logsData] = await Promise.all([
        getQuickActions(),
        getQuickActionLogs(new Date().toISOString().split('T')[0])
      ])
      setActions(actionsData.actions || [])
      setLogs(logsData.logs || [])
    } catch (e) {
      console.error(e)
      showToast('Failed to load quick actions', 'error')
    } finally { setLoading(false) }
  }

  const handleExecuteAction = async (actionId: number) => {
    try {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const date = now.toISOString().split('T')[0]
      await createQuickActionLog({ actionId, date, time, count: 1 })
      setLogs(prev => {
        const existing = prev.find(l => l.actionId === actionId)
        return existing ? prev.map(l => l.actionId === actionId ? { ...l, count: l.count + 1 } : l) : [...prev, { actionId, count: 1 }]
      })
    } catch (e) { console.error(e); showToast('Failed to execute action', 'error') }
  }

  const handleAddAction = async () => {
    if (!newAction.name) { showToast('Action name is required', 'error'); return }
    try {
      setSubmitting(true)
      showToast('Creating action...', 'loading')
      const data = await createQuickAction(newAction)
      if (data.action) { setActions(prev => [...prev, data.action]); setNewAction({ name: '', emoji: '✨', description: '', color: 'blue' }); setIsEditing(false); showToast('Action created successfully', 'success') }
    } catch (e) { console.error(e); showToast('Failed to create action', 'error') } finally { setSubmitting(false) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>

  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-4 md:px-8 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Quick Actions</h1>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} disabled={submitting} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">+ New Action</button>
          )}
        </div>

        {isEditing && (
          <QuickActionForm
            actionName={newAction.name}
            onNameChange={name => setNewAction({ ...newAction, name })}
            emoji={newAction.emoji}
            onEmojiChange={emoji => setNewAction({ ...newAction, emoji })}
            description={newAction.description}
            onDescriptionChange={description => setNewAction({ ...newAction, description })}
            color={newAction.color}
            onColorChange={color => setNewAction({ ...newAction, color })}
            colors={colors}
            onSubmit={handleAddAction}
            onCancel={() => { setIsEditing(false); setNewAction({ name: '', emoji: '✨', description: '', color: 'blue' }) }}
            isLoading={submitting}
          />
        )}

        <QuickActionsList actions={actions} logs={logs} onExecute={handleExecuteAction} />
      </div>
    </div>
  )
}
