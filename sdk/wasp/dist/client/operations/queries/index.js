import { createQuery } from './core.js';
// PUBLIC API
export const getParentStudentsBalance = createQuery('operations/get-parent-students-balance', ['Student', 'MealPackage', 'StudentAllergy', 'Payment']);
// PUBLIC API
export const validateStudentForPOS = createQuery('operations/validate-student-for-pos', ['Student', 'MealPackage', 'StudentAllergy', 'MenuItemRecipe']);
// PUBLIC API
export const getDailyPOSSummary = createQuery('operations/get-daily-possummary', ['DeliveryRecord', 'MealPackage', 'Student']);
// PUBLIC API
export const getMenuItemsCatalog = createQuery('operations/get-menu-items-catalog', ['MenuItemRecipe']);
// PUBLIC API
export const getAdminLedgerAudit = createQuery('operations/get-admin-ledger-audit', ['LedgerEntry', 'LedgerAccount', 'Payment', 'AuditLog']);
// PRIVATE API (used in SDK)
export { buildAndRegisterQuery } from './core.js';
//# sourceMappingURL=index.js.map