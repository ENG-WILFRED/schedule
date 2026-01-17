export type { NotificationTemplateInput } from './types'

// Query exports
export {
  getTemplate,
  getTemplateByName,
  getTemplatesByType,
  getAllTemplates,
  getTemplates,
  getDefaultTemplate
} from './queries'

// Mutation exports
export {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate
} from './mutations'
