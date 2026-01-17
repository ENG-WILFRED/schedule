'use server'

// Deprecated: This file is kept for backward compatibility.
// Please import from './templates' instead.
// Example: import { getTemplates } from '../actions/notification/templates'

export type { NotificationTemplateInput } from './templates/types'
export {
  getTemplate,
  getTemplateByName,
  getTemplatesByType,
  getAllTemplates,
  getTemplates,
  getDefaultTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate
} from './templates'



