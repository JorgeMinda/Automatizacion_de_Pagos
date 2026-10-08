import { type ActionFor, createAction } from './core'
import type { ProcessDirectPayment_ext } from '../../../server/operations/actions/index.js'
import type { RegisterStudentForParent_ext } from '../../../server/operations/actions/index.js'
import type { SetUserRole_ext } from '../../../server/operations/actions/index.js'
import type { DispatchMealConsumption_ext } from '../../../server/operations/actions/index.js'
import type { SyncOfflineBatchDeliveries_ext } from '../../../server/operations/actions/index.js'
import type { CreateMenuItemRecipe_ext } from '../../../server/operations/actions/index.js'

// PUBLIC API
export const processDirectPayment: ActionFor<ProcessDirectPayment_ext> = createAction<ProcessDirectPayment_ext>(
  'operations/process-direct-payment',
  ['Payment', 'Student', 'MealPackage', 'LedgerAccount', 'LedgerEntry', 'AuditLog'],
)

// PUBLIC API
export const registerStudentForParent: ActionFor<RegisterStudentForParent_ext> = createAction<RegisterStudentForParent_ext>(
  'operations/register-student-for-parent',
  ['Student', 'StudentAllergy'],
)

// PUBLIC API
export const setUserRole: ActionFor<SetUserRole_ext> = createAction<SetUserRole_ext>(
  'operations/set-user-role',
  ['User'],
)

// PUBLIC API
export const dispatchMealConsumption: ActionFor<DispatchMealConsumption_ext> = createAction<DispatchMealConsumption_ext>(
  'operations/dispatch-meal-consumption',
  ['DeliveryRecord', 'Student', 'MealPackage', 'MenuItemRecipe', 'LedgerAccount', 'LedgerEntry', 'AuditLog'],
)

// PUBLIC API
export const syncOfflineBatchDeliveries: ActionFor<SyncOfflineBatchDeliveries_ext> = createAction<SyncOfflineBatchDeliveries_ext>(
  'operations/sync-offline-batch-deliveries',
  ['DeliveryRecord', 'Student', 'MealPackage', 'MenuItemRecipe', 'LedgerAccount', 'LedgerEntry', 'AuditLog'],
)

// PUBLIC API
export const createMenuItemRecipe: ActionFor<CreateMenuItemRecipe_ext> = createAction<CreateMenuItemRecipe_ext>(
  'operations/create-menu-item-recipe',
  ['MenuItemRecipe'],
)
