
import { prisma } from '../../index.js'
import {
  type UnauthenticatedOperationFor,
  createUnauthenticatedOperation,
  type AuthenticatedOperationFor,
  createAuthenticatedOperation,
} from '../wrappers.js'
import { getParentStudentsBalance as getParentStudentsBalance_ext } from 'wasp/src/modules/payments/queries'
import { validateStudentForPOS as validateStudentForPOS_ext } from 'wasp/src/modules/pos/queries'
import { getDailyPOSSummary as getDailyPOSSummary_ext } from 'wasp/src/modules/pos/queries'
import { getMenuItemsCatalog as getMenuItemsCatalog_ext } from 'wasp/src/modules/inventory/queries'
import { getAdminLedgerAudit as getAdminLedgerAudit_ext } from 'wasp/src/modules/payments/queries'

// PRIVATE API
export type GetParentStudentsBalance_ext = typeof getParentStudentsBalance_ext

// PUBLIC API
export const getParentStudentsBalance: AuthenticatedOperationFor<GetParentStudentsBalance_ext> =
  createAuthenticatedOperation(
    getParentStudentsBalance_ext,
    {
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      StudentAllergy: prisma.studentAllergy,
      Payment: prisma.payment,
    },
  )


// PRIVATE API
export type ValidateStudentForPOS_ext = typeof validateStudentForPOS_ext

// PUBLIC API
export const validateStudentForPOS: AuthenticatedOperationFor<ValidateStudentForPOS_ext> =
  createAuthenticatedOperation(
    validateStudentForPOS_ext,
    {
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      StudentAllergy: prisma.studentAllergy,
      MenuItemRecipe: prisma.menuItemRecipe,
    },
  )


// PRIVATE API
export type GetDailyPOSSummary_ext = typeof getDailyPOSSummary_ext

// PUBLIC API
export const getDailyPOSSummary: AuthenticatedOperationFor<GetDailyPOSSummary_ext> =
  createAuthenticatedOperation(
    getDailyPOSSummary_ext,
    {
      DeliveryRecord: prisma.deliveryRecord,
      MealPackage: prisma.mealPackage,
      Student: prisma.student,
    },
  )


// PRIVATE API
export type GetMenuItemsCatalog_ext = typeof getMenuItemsCatalog_ext

// PUBLIC API
export const getMenuItemsCatalog: AuthenticatedOperationFor<GetMenuItemsCatalog_ext> =
  createAuthenticatedOperation(
    getMenuItemsCatalog_ext,
    {
      MenuItemRecipe: prisma.menuItemRecipe,
    },
  )


// PRIVATE API
export type GetAdminLedgerAudit_ext = typeof getAdminLedgerAudit_ext

// PUBLIC API
export const getAdminLedgerAudit: AuthenticatedOperationFor<GetAdminLedgerAudit_ext> =
  createAuthenticatedOperation(
    getAdminLedgerAudit_ext,
    {
      LedgerEntry: prisma.ledgerEntry,
      LedgerAccount: prisma.ledgerAccount,
      Payment: prisma.payment,
      AuditLog: prisma.auditLog,
    },
  )

