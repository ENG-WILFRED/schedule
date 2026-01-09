'use client'
import React, { useEffect, useState } from 'react'
import { getProviderConfig, saveProviderConfig } from '../app/actions/notifications'
import { showToast } from './ToastContainer'

export default function ProvidersSection() {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const data = await getProviderConfig()
        setForm(data.config || {})
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const toastId = showToast('Saving provider settings...', 'loading')
    try {
      await saveProviderConfig(form)
      showToast('Provider settings saved successfully', 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to save provider settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null

  return (
    <div className="mt-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
      <h3 className="text-white font-bold mb-4">Providers</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm text-slate-300 font-semibold mb-2">SMTP (Email)</h4>
          <input value={form.smtpHost || ''} onChange={e => setForm({ ...form, smtpHost: e.target.value })} placeholder="SMTP Host" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
          <input value={form.smtpPort || 587} onChange={e => setForm({ ...form, smtpPort: Number(e.target.value) })} placeholder="SMTP Port" type="number" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
          <input value={form.smtpUsername || ''} onChange={e => setForm({ ...form, smtpUsername: e.target.value })} placeholder="SMTP Username" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
          <input value={form.smtpPassword || ''} onChange={e => setForm({ ...form, smtpPassword: e.target.value })} placeholder="SMTP Password" type="password" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
          <input value={form.smtpFrom || ''} onChange={e => setForm({ ...form, smtpFrom: e.target.value })} placeholder="From Address" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
        </div>

        <div>
          <h4 className="text-sm text-slate-300 font-semibold mb-2">SMS Provider</h4>
          <input value={form.smsUrl || ''} onChange={e => setForm({ ...form, smsUrl: e.target.value })} placeholder="SMS URL" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
          <input value={form.smsApiKey || ''} onChange={e => setForm({ ...form, smsApiKey: e.target.value })} placeholder="SMS API Key" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
          <input value={form.smsPartnerId || ''} onChange={e => setForm({ ...form, smsPartnerId: e.target.value })} placeholder="Partner ID" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
          <input value={form.smsShortcode || ''} onChange={e => setForm({ ...form, smsShortcode: e.target.value })} placeholder="Shortcode" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
          <input value={form.smsPassType || 'plain'} onChange={e => setForm({ ...form, smsPassType: e.target.value })} placeholder="Pass Type" disabled={saving} className="w-full mb-2 rounded p-2 bg-white/5 text-white disabled:opacity-50" />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="px-4 py-2 rounded bg-gradient-to-r from-violet-500 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
        >
          {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saving ? 'Saving...' : 'Save Providers'}
        </button>
      </div>
    </div>
  )
}
