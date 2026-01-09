'use client'
import React, { useEffect } from 'react'

interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'error' | 'loading'
  duration?: number
}

let toastId = 0
const toastListeners: Set<(toasts: Toast[]) => void> = new Set()
let currentToasts: Toast[] = []

export function showToast(message: string, type: 'info' | 'success' | 'error' | 'loading' = 'info', duration = 3000) {
  const id = String(toastId++)
  const toast: Toast = { id, message, type, duration }
  currentToasts = [...currentToasts, toast]
  notifyListeners()
  
  if (duration > 0 && type !== 'loading') {
    setTimeout(() => {
      currentToasts = currentToasts.filter(t => t.id !== id)
      notifyListeners()
    }, duration)
  }
  
  return id
}

export function removeToast(id: string) {
  currentToasts = currentToasts.filter(t => t.id !== id)
  notifyListeners()
}

export function updateToast(id: string, updates: Partial<Toast>) {
  currentToasts = currentToasts.map(t => t.id === id ? { ...t, ...updates } : t)
  notifyListeners()
}

function notifyListeners() {
  toastListeners.forEach(listener => listener([...currentToasts]))
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    toastListeners.add(setToasts)
    return () => {
      toastListeners.delete(setToasts)
    }
  }, [])

  return { toasts }
}

export default function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 space-y-3 pointer-events-none z-50">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300 px-4 py-3 rounded-lg text-white font-medium flex items-center gap-3 max-w-xs shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-500/90 backdrop-blur-sm border border-emerald-400/30' :
            toast.type === 'error' ? 'bg-rose-500/90 backdrop-blur-sm border border-rose-400/30' :
            toast.type === 'loading' ? 'bg-blue-500/90 backdrop-blur-sm border border-blue-400/30' :
            'bg-slate-600/90 backdrop-blur-sm border border-slate-400/30'
          }`}
        >
          {toast.type === 'loading' && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {toast.type === 'success' && <span>✓</span>}
          {toast.type === 'error' && <span>✕</span>}
          {toast.type === 'info' && <span>ℹ</span>}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
