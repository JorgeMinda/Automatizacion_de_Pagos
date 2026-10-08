
import { prisma } from '../../index.js'
import {
  type UnauthenticatedOperationFor,
  createUnauthenticatedOperation,
  type AuthenticatedOperationFor,
  createAuthenticatedOperation,
} from '../wrappers.js'
import { processDirectPayment as processDirectPayment_ext } from 'wasp/src/modules/payments/actions'
import { registerStudentForParent as registerStudentForParent_ext } from 'wasp/src/modules/payments/actions'
import { setUserRole as setUserRole_ext } from 'wasp/src/modules/payments/actions'
import { dispatchMealConsumption as dispatchMealConsumption_ext } from 'wasp/src/modules/pos/actions'
import { syncOfflineBatchDeliveries as syncOfflineBatchDeliveries_ext } from 'wasp/src/modules/pos/actions'
import { createMenuItemRecipe as createMenuItemRecipe_ext } from 'wasp/src/modules/inventory/actions'

// PRIVATE API
export type ProcessDirectPayment_ext = typeof processDirectPayment_ext

// PUBLIC API
export const processDirectPayment: AuthenticatedOperationFor<ProcessDirectPayment_ext> =
  createAuthenticatedOperation(
    processDirectPayment_ext,
    {
      Payment: prisma.payment,
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      LedgerAccount: prisma.ledgerAccount,
      LedgerEntry: prisma.ledgerEntry,
      AuditLog: prisma.auditLog,
    },
  )

// PRIVATE API
export type RegisterStudentForParent_ext = typeof registerStudentForParent_ext

// PUBLIC API
export const registerStudentForParent: AuthenticatedOperationFor<RegisterStudentForParent_ext> =
  createAuthenticatedOperation(
    registerStudentForParent_ext,
    {
      Student: prisma.student,
      StudentAllergy: prisma.studentAllergy,
    },
  )

// PRIVATE API
export type SetUserRole_ext = typeof setUserRole_ext

// PUBLIC API
export const setUserRole: AuthenticatedOperationFor<SetUserRole_ext> =
  createAuthenticatedOperation(
    setUserRole_ext,
    {
      User: prisma.user,
    },
  )

// PRIVATE API
export type DispatchMealConsumption_ext = typeof dispatchMealConsumption_ext

// PUBLIC API
export const dispatchMealConsumption: AuthenticatedOperationFor<DispatchMealConsumption_ext> =
  createAuthenticatedOperation(
    dispatchMealConsumption_ext,
    {
      DeliveryRecord: prisma.deliveryRecord,
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      MenuItemRecipe: prisma.menuItemRecipe,
      LedgerAccount: prisma.ledgerAccount,
      LedgerEntry: prisma.ledgerEntry,
      AuditLog: prisma.auditLog,
    },
  )

// PRIVATE API
export type SyncOfflineBatchDeliveries_ext = typeof syncOfflineBatchDeliveries_ext

// PUBLIC API
export const syncOfflineBatchDeliveries: AuthenticatedOperationFor<SyncOfflineBatchDeliveries_ext> =
  createAuthenticatedOperation(
    syncOfflineBatchDeliveries_ext,
    {
      DeliveryRecord: prisma.deliveryRecord,
      Student: prisma.student,
      MealPackage: prisma.mealPackage,
      MenuItemRecipe: prisma.menuItemRecipe,
      LedgerAccount: prisma.ledgerAccount,
      LedgerEntry: prisma.ledgerEntry,
      AuditLog: prisma.auditLog,
    },
  )

// PRIVATE API
export type CreateMenuItemRecipe_ext = typeof createMenuItemRecipe_ext

// PUBLIC API
export const createMenuItemRecipe: AuthenticatedOperationFor<CreateMenuItemRecipe_ext> =
  createAuthenticatedOperation(
    createMenuItemRecipe_ext,
    {
      MenuItemRecipe: prisma.menuItemRecipe,
    },
  )
