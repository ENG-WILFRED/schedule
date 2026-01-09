"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTemplates, seedTemplates, updateTemplate } from '../../../actions/notification/template'
import { showToast } from '../../../../components/ToastContainer'
import TemplateCard from '../../../../components/TemplateCard'
import TemplateEditor from '../../../../components/TemplateEditor'

type Template = {
  id: number
  name: string
  type: 'email' | 'sms'
  subject?: string
  body: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [seedLoading, setSeedLoading] = useState(false)
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null)
  const [editingTemplateBody, setEditingTemplateBody] = useState('')
  const [editingTemplateSubject, setEditingTemplateSubject] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      const templateData = await getTemplates()
      setTemplates((templateData as any).templates || [])
    } catch (e) {
      console.error(e)
      showToast('Failed to load templates', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSeedTemplates() {
    try {
      setSeedLoading(true)
      await seedTemplates()
      showToast('Default templates seeded successfully', 'success')
      load()
    } catch (e) {
      showToast('Failed to seed templates', 'error')
    } finally {
      setSeedLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black px-4 py-10 w-full">
        <div className="w-full">
          <p className="text-center text-slate-300">⟳ Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black px-4 py-10 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/settings/notifications"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
          >
            ← Back
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Notification Templates</h1>
            <p className="text-slate-400 text-sm mt-1">Manage email and SMS message templates with custom variables</p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-violet-300">All Templates</h2>
            <button
              onClick={handleSeedTemplates}
              disabled={seedLoading}
              className="px-4 py-2 rounded-lg bg-violet-600/50 hover:bg-violet-600 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {seedLoading ? '⟳ Seeding...' : 'Seed Default Templates'}
            </button>
          </div>

          {templates.length === 0 ? (
            <p className="text-center text-slate-400 py-12">No templates yet. Click "Seed Default Templates" to create default templates.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((t) => (
                <TemplateCard
                  key={t.id}
                  t={t}
                  onCustomize={(tpl) => {
                    setEditingTemplateId(tpl.id)
                    setEditingTemplateBody(tpl.body)
                    setEditingTemplateSubject(tpl.subject || '')
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Template Editor Modal */}
        {editingTemplateId && (
          <TemplateEditor
            id={editingTemplateId}
            initialSubject={editingTemplateSubject}
            initialBody={editingTemplateBody}
            onCancel={() => {
              setEditingTemplateId(null)
              setEditingTemplateBody('')
              setEditingTemplateSubject('')
            }}
            onSave={async (id, subject, body) => {
              try {
                await updateTemplate(id, { subject, body } as any)
                showToast('Template updated successfully', 'success')
                setEditingTemplateId(null)
                setEditingTemplateBody('')
                setEditingTemplateSubject('')
                load()
              } catch (e) {
                showToast('Failed to update template', 'error')
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
