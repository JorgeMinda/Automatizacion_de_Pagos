import { createAction } from './core';
// PUBLIC API
export const processDirectPayment = createAction('operations/process-direct-payment', ['Payment', 'Student', 'MealPackage', 'LedgerAccount', 'LedgerEntry', 'AuditLog']);
// PUBLIC API
export const registerStudentForParent = createAction('operations/register-student-for-parent', ['Student', 'StudentAllergy']);
// PUBLIC API
export const setUserRole = createAction('operations/set-user-role', ['User']);
// PUBLIC API
export const dispatchMealConsumption = createAction('operations/dispatch-meal-consumption', ['DeliveryRecord', 'Student', 'MealPackage', 'MenuItemRecipe', 'LedgerAccount', 'LedgerEntry', 'AuditLog']);
// PUBLIC API
export const syncOfflineBatchDeliveries = createAction('operations/sync-offline-batch-deliveries', ['DeliveryRecord', 'Student', 'MealPackage', 'MenuItemRecipe', 'LedgerAccount', 'LedgerEntry', 'AuditLog']);
// PUBLIC API
export const createMenuItemRecipe = createAction('operations/create-menu-item-recipe', ['MenuItemRecipe']);
//# sourceMappingURL=index.js.map