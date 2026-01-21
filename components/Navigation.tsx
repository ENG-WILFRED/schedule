"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const navItems = [
    { path: '/', label: '📅 Today', icon: '📅' },
    { path: '/activity', label: '📝 Activity', icon: '📝' },
    { path: '/coding', label: '💻 Coding Plans', icon: '💻' },
    { path: '/settings/notifications', label: '🔔 Notifications', icon: '🔔' },
    { path: '/settings/routine', label: '⏰ Routines', icon: '⏰' },
  ]

  // Get current section name
  const currentSection = navItems.find(item => isActive(item.path))?.label || '📅 Today'

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [dropdownHeight, setDropdownHeight] = useState<number>(0)

  useEffect(() => {
    if (!mobileMenuOpen) {
      setDropdownHeight(0)
      return
    }
    const measure = () => {
      const h = dropdownRef.current?.getBoundingClientRect().height || 0
      setDropdownHeight(Math.ceil(h))
    }
    // Measure after paint
    requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [mobileMenuOpen])

  const handleNavClick = (path: string) => {
    router.push(path)
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Note: dropdown has its own backdrop-blur; no separate overlay is rendered so only the dropdown background appears frosted. */}

      <nav className="bg-gradient-to-r from-electric-blue via-cyan-teal to-vivid-magenta backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-black text-text-primary">{currentSection}</h1>
            </div>
            
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap font-semibold text-sm ${
                    isActive(item.path)
                      ? 'bg-yellow-bright text-base-dark shadow-xl'
                      : 'text-text-secondary hover:bg-white/20 hover:text-text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between h-16 relative">
            <div className="flex-shrink-0">
              <h1 className="text-lg font-black text-text-primary">{currentSection}</h1>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-primary text-2xl font-bold focus:outline-none"
              aria-label="Toggle menu"
            >
              ☰
            </button>

            {/* Mobile Vertical Menu - Absolutely Positioned */}
            {mobileMenuOpen && (
              <div ref={dropdownRef} className="absolute top-full left-0 right-0 z-50 bg-gradient-to-b from-electric-blue via-cyan-teal to-vivid-magenta border-t border-white/20 shadow-lg backdrop-blur-md bg-opacity-95">
                <div className="px-4 py-4 space-y-2">
                  {navItems.map(item => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all font-semibold ${
                        isActive(item.path)
                          ? 'bg-yellow-bright text-base-dark shadow-xl'
                          : 'text-text-secondary hover:bg-white/20 hover:text-text-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
