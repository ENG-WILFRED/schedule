import { NextRequest, NextResponse } from 'next/server'
import { checkAndTriggerScheduledNotifications } from '../../../../lib/notification-scheduler'

/**
 * POST /cron/notifications
 * Endpoint for external cron jobs to trigger notification checks
 * Can be called by services like EasyCron, AWS EventBridge, GitHub Actions, Vercel Cron, etc.
 * 
 * Example usage:
 * curl -X POST https://yourdomain.com/cron/notifications \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET" \
 *   -H "Content-Type: application/json"
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Validate cron secret if provided
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await checkAndTriggerScheduledNotifications()

    return NextResponse.json(
      { success: true, ...result },
      { status: 200 }
    )
  } catch (error) {
    console.error('Cron notification check error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check notifications',
      },
      { status: 500 }
    )
  }
}
