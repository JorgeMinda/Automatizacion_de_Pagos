import { prisma } from '../../index.js';
import { createAuthenticatedOperation, } from '../wrappers.js';
import { getParentStudentsBalance as getParentStudentsBalance_ext } from 'wasp/src/modules/payments/queries';
import { validateStudentForPOS as validateStudentForPOS_ext } from 'wasp/src/modules/pos/queries';
import { getDailyPOSSummary as getDailyPOSSummary_ext } from 'wasp/src/modules/pos/queries';
import { getMenuItemsCatalog as getMenuItemsCatalog_ext } from 'wasp/src/modules/inventory/queries';
import { getAdminLedgerAudit as getAdminLedgerAudit_ext } from 'wasp/src/modules/payments/queries';
// PUBLIC API
export const getParentStudentsBalance = createAuthenticatedOperation(getParentStudentsBalance_ext, {
    Student: prisma.student,
    MealPackage: prisma.mealPackage,
    StudentAllergy: prisma.studentAllergy,
    Payment: prisma.payment,
});
// PUBLIC API
export const validateStudentForPOS = createAuthenticatedOperation(validateStudentForPOS_ext, {
    Student: prisma.student,
    MealPackage: prisma.mealPackage,
    StudentAllergy: prisma.studentAllergy,
    MenuItemRecipe: prisma.menuItemRecipe,
});
// PUBLIC API
export const getDailyPOSSummary = createAuthenticatedOperation(getDailyPOSSummary_ext, {
    DeliveryRecord: prisma.deliveryRecord,
    MealPackage: prisma.mealPackage,
    Student: prisma.student,
});
// PUBLIC API
export const getMenuItemsCatalog = createAuthenticatedOperation(getMenuItemsCatalog_ext, {
    MenuItemRecipe: prisma.menuItemRecipe,
});
// PUBLIC API
export const getAdminLedgerAudit = createAuthenticatedOperation(getAdminLedgerAudit_ext, {
    LedgerEntry: prisma.ledgerEntry,
    LedgerAccount: prisma.ledgerAccount,
    Payment: prisma.payment,
    AuditLog: prisma.auditLog,
});
//# sourceMappingURL=index.js.map