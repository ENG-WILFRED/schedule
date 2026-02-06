'use client'
import Navigation from '../components/Navigation'
import ToastContainer from '../components/ToastContainer'
import { useState, createContext, useContext, ReactNode } from 'react'

const LoadingContext = createContext<{ isLoading: boolean; setIsLoading: (val: boolean) => void } | null>(null)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) throw new Error('useLoading must be used within LoadingProvider')
  return context
}

function LoadingSpinner() {
  const { isLoading } = useLoading()
  if (!isLoading) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/20 backdrop-blur-sm">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-bright border-r-cyan-teal animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-electric-blue/50 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-electric-blue to-cyan-teal opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-bright"></div>
      </div>
    </div>
  )
}

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <ToastContainer />
      <LoadingSpinner />
    </LoadingContext.Provider>
  )
}
