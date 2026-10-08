import express from 'express'

import auth from 'wasp/core/auth'

import processDirectPayment from './processDirectPayment.js'
import registerStudentForParent from './registerStudentForParent.js'
import setUserRole from './setUserRole.js'
import dispatchMealConsumption from './dispatchMealConsumption.js'
import syncOfflineBatchDeliveries from './syncOfflineBatchDeliveries.js'
import createMenuItemRecipe from './createMenuItemRecipe.js'
import getParentStudentsBalance from './getParentStudentsBalance.js'
import validateStudentForPOS from './validateStudentForPOS.js'
import getDailyPOSSummary from './getDailyPOSSummary.js'
import getMenuItemsCatalog from './getMenuItemsCatalog.js'
import getAdminLedgerAudit from './getAdminLedgerAudit.js'

const router = express.Router()

router.post('/process-direct-payment', auth, processDirectPayment)
router.post('/register-student-for-parent', auth, registerStudentForParent)
router.post('/set-user-role', auth, setUserRole)
router.post('/dispatch-meal-consumption', auth, dispatchMealConsumption)
router.post('/sync-offline-batch-deliveries', auth, syncOfflineBatchDeliveries)
router.post('/create-menu-item-recipe', auth, createMenuItemRecipe)
router.post('/get-parent-students-balance', auth, getParentStudentsBalance)
router.post('/validate-student-for-pos', auth, validateStudentForPOS)
router.post('/get-daily-possummary', auth, getDailyPOSSummary)
router.post('/get-menu-items-catalog', auth, getMenuItemsCatalog)
router.post('/get-admin-ledger-audit', auth, getAdminLedgerAudit)

export default router
