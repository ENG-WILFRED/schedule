'use server'

export type NotificationTemplateInput = {
  name: string
  description?: string
  type: 'email' | 'sms'
  subject?: string
  body: string
  keys?: string[] // Required template variables
  isDefault?: boolean
}
