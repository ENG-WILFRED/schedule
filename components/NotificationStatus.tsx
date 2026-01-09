import React from 'react'

export default function NotificationStatus({ nextReminder }: { nextReminder?: string }) {
  return (
    <div className="card-base">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary-magenta mb-1">🔔 Notifications</h3>
          <p className="text-sm text-primary-blue/70">Smart nudges keep you on track</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-blue/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary-magenta animate-pulse"></div>
        </div>
      </div>
      <div className="bg-white-off/90 rounded-lg p-3">
        <p className="text-sm">
          <span className="text-primary-magenta font-semibold">Next reminder:</span>
          <span className="text-primary-blue ml-2">{nextReminder || 'None scheduled'}</span>
        </p>
      </div>
    </div>
  )
}
