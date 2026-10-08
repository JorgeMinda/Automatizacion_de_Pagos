import { prisma } from '../../index.js';
import { createAuthenticatedOperation, } from '../wrappers.js';
import { processDirectPayment as processDirectPayment_ext } from 'wasp/src/modules/payments/actions';
import { registerStudentForParent as registerStudentForParent_ext } from 'wasp/src/modules/payments/actions';
import { setUserRole as setUserRole_ext } from 'wasp/src/modules/payments/actions';
import { dispatchMealConsumption as dispatchMealConsumption_ext } from 'wasp/src/modules/pos/actions';
import { syncOfflineBatchDeliveries as syncOfflineBatchDeliveries_ext } from 'wasp/src/modules/pos/actions';
import { createMenuItemRecipe as createMenuItemRecipe_ext } from 'wasp/src/modules/inventory/actions';
// PUBLIC API
export const processDirectPayment = createAuthenticatedOperation(processDirectPayment_ext, {
    Payment: prisma.payment,
    Student: prisma.student,
    MealPackage: prisma.mealPackage,
    LedgerAccount: prisma.ledgerAccount,
    LedgerEntry: prisma.ledgerEntry,
    AuditLog: prisma.auditLog,
});
// PUBLIC API
export const registerStudentForParent = createAuthenticatedOperation(registerStudentForParent_ext, {
    Student: prisma.student,
    StudentAllergy: prisma.studentAllergy,
});
// PUBLIC API
export const setUserRole = createAuthenticatedOperation(setUserRole_ext, {
    User: prisma.user,
});
// PUBLIC API
export const dispatchMealConsumption = createAuthenticatedOperation(dispatchMealConsumption_ext, {
    DeliveryRecord: prisma.deliveryRecord,
    Student: prisma.student,
    MealPackage: prisma.mealPackage,
    MenuItemRecipe: prisma.menuItemRecipe,
    LedgerAccount: prisma.ledgerAccount,
    LedgerEntry: prisma.ledgerEntry,
    AuditLog: prisma.auditLog,
});
// PUBLIC API
export const syncOfflineBatchDeliveries = createAuthenticatedOperation(syncOfflineBatchDeliveries_ext, {
    DeliveryRecord: prisma.deliveryRecord,
    Student: prisma.student,
    MealPackage: prisma.mealPackage,
    MenuItemRecipe: prisma.menuItemRecipe,
    LedgerAccount: prisma.ledgerAccount,
    LedgerEntry: prisma.ledgerEntry,
    AuditLog: prisma.auditLog,
});
// PUBLIC API
export const createMenuItemRecipe = createAuthenticatedOperation(createMenuItemRecipe_ext, {
    MenuItemRecipe: prisma.menuItemRecipe,
});
//# sourceMappingURL=index.js.map