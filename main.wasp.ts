import { app, page, route, query, action } from "@wasp.sh/spec";

import { App } from "./src/client/App" with { type: "ref" };
import { LandingPage } from "./src/client/pages/LandingPage" with { type: "ref" };
import { LoginPage } from "./src/client/pages/LoginPage" with { type: "ref" };
import { ParentDashboardPage } from "./src/client/pages/ParentDashboardPage" with { type: "ref" };
import { POSCheckoutPage } from "./src/client/pages/POSCheckoutPage" with { type: "ref" };
import { AdminReportsPage } from "./src/client/pages/AdminReportsPage" with { type: "ref" };

import { getParentStudentsBalance, getAdminLedgerAudit } from "./src/modules/payments/queries" with { type: "ref" };
import { processDirectPayment, registerStudentForParent, setUserRole } from "./src/modules/payments/actions" with { type: "ref" };

import { validateStudentForPOS, getDailyPOSSummary } from "./src/modules/pos/queries" with { type: "ref" };
import { dispatchMealConsumption, syncOfflineBatchDeliveries } from "./src/modules/pos/actions" with { type: "ref" };

import { getMenuItemsCatalog } from "./src/modules/inventory/queries" with { type: "ref" };
import { createMenuItemRecipe } from "./src/modules/inventory/actions" with { type: "ref" };

export default app({
  name: "school_lunch_automation",
  wasp: { version: "^0.25.0" },
  title: "School Lunch & Payment Automation System",
  auth: {
    userEntity: "User",
    methods: {
      usernameAndPassword: {},
    },
    onAuthFailedRedirectTo: "/login",
  },
  client: {
    rootComponent: App,
  },
  spec: [
    route("RootRoute", "/", page(LandingPage)),
    route("LoginRoute", "/login", page(LoginPage)),
    route("ParentDashboardRoute", "/parent/dashboard", page(ParentDashboardPage, { authRequired: true })),
    route("POSCheckoutRoute", "/pos/checkout", page(POSCheckoutPage, { authRequired: true })),
    route("AdminReportsRoute", "/admin/reports", page(AdminReportsPage, { authRequired: true })),

    // Queries
    query(getParentStudentsBalance, { entities: ["Student", "MealPackage", "StudentAllergy", "Payment"] }),
    query(validateStudentForPOS, { entities: ["Student", "MealPackage", "StudentAllergy", "MenuItemRecipe"] }),
    query(getDailyPOSSummary, { entities: ["DeliveryRecord", "MealPackage", "Student"] }),
    query(getMenuItemsCatalog, { entities: ["MenuItemRecipe"] }),
    query(getAdminLedgerAudit, { entities: ["LedgerEntry", "LedgerAccount", "Payment", "AuditLog"] }),

    // Actions
    action(processDirectPayment, { entities: ["Payment", "Student", "MealPackage", "LedgerAccount", "LedgerEntry", "AuditLog"] }),
    action(registerStudentForParent, { entities: ["Student", "StudentAllergy"] }),
    action(setUserRole, { entities: ["User"] }),
    action(dispatchMealConsumption, { entities: ["DeliveryRecord", "Student", "MealPackage", "MenuItemRecipe", "LedgerAccount", "LedgerEntry", "AuditLog"] }),
    action(syncOfflineBatchDeliveries, { entities: ["DeliveryRecord", "Student", "MealPackage", "MenuItemRecipe", "LedgerAccount", "LedgerEntry", "AuditLog"] }),
    action(createMenuItemRecipe, { entities: ["MenuItemRecipe"] }),
  ],
});


