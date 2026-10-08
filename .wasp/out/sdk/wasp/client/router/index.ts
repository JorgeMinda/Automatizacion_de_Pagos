import { interpolatePath } from './linkHelpers'
import type {
  RouteDefinitionsToRoutes,
  OptionalRouteOptions,
  ParamValue,
  ExpandRouteOnOptionalStaticSegments,
} from './types'

// PUBLIC API
export const routes = {
  RootRoute: {
    to: "/",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  LoginRoute: {
    to: "/login",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/login",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  ParentDashboardRoute: {
    to: "/parent/dashboard",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/parent/dashboard",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  POSCheckoutRoute: {
    to: "/pos/checkout",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/pos/checkout",
        undefined,
        options?.search,
        options?.hash
      ),
  },
  AdminReportsRoute: {
    to: "/admin/reports",
    build: (
      options?:
      OptionalRouteOptions
    ) => interpolatePath(
        
        "/admin/reports",
        undefined,
        options?.search,
        options?.hash
      ),
  },
} as const;

// PRIVATE API
export type Routes = RouteDefinitionsToRoutes<typeof routes>

// PUBLIC API
export { Link } from './Link'
// PUBLIC API
export { NavLink } from './NavLink'
