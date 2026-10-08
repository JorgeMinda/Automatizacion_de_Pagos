import { type QueryFor, createQuery } from './core'
import type { GetParentStudentsBalance_ext } from '../../../server/operations/queries/index.js'
import type { ValidateStudentForPOS_ext } from '../../../server/operations/queries/index.js'
import type { GetDailyPOSSummary_ext } from '../../../server/operations/queries/index.js'
import type { GetMenuItemsCatalog_ext } from '../../../server/operations/queries/index.js'
import type { GetAdminLedgerAudit_ext } from '../../../server/operations/queries/index.js'

// PUBLIC API
export const getParentStudentsBalance: QueryFor<GetParentStudentsBalance_ext> = createQuery<GetParentStudentsBalance_ext>(
  'operations/get-parent-students-balance',
  ['Student', 'MealPackage', 'StudentAllergy', 'Payment'],
)

// PUBLIC API
export const validateStudentForPOS: QueryFor<ValidateStudentForPOS_ext> = createQuery<ValidateStudentForPOS_ext>(
  'operations/validate-student-for-pos',
  ['Student', 'MealPackage', 'StudentAllergy', 'MenuItemRecipe'],
)

// PUBLIC API
export const getDailyPOSSummary: QueryFor<GetDailyPOSSummary_ext> = createQuery<GetDailyPOSSummary_ext>(
  'operations/get-daily-possummary',
  ['DeliveryRecord', 'MealPackage', 'Student'],
)

// PUBLIC API
export const getMenuItemsCatalog: QueryFor<GetMenuItemsCatalog_ext> = createQuery<GetMenuItemsCatalog_ext>(
  'operations/get-menu-items-catalog',
  ['MenuItemRecipe'],
)

// PUBLIC API
export const getAdminLedgerAudit: QueryFor<GetAdminLedgerAudit_ext> = createQuery<GetAdminLedgerAudit_ext>(
  'operations/get-admin-ledger-audit',
  ['LedgerEntry', 'LedgerAccount', 'Payment', 'AuditLog'],
)

// PRIVATE API (used in SDK)
export { buildAndRegisterQuery } from './core'
