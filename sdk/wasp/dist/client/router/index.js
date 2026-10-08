import { interpolatePath } from './linkHelpers';
// PUBLIC API
export const routes = {
    RootRoute: {
        to: "/",
        build: (options) => interpolatePath("/", undefined, options?.search, options?.hash),
    },
    LoginRoute: {
        to: "/login",
        build: (options) => interpolatePath("/login", undefined, options?.search, options?.hash),
    },
    ParentDashboardRoute: {
        to: "/parent/dashboard",
        build: (options) => interpolatePath("/parent/dashboard", undefined, options?.search, options?.hash),
    },
    POSCheckoutRoute: {
        to: "/pos/checkout",
        build: (options) => interpolatePath("/pos/checkout", undefined, options?.search, options?.hash),
    },
    AdminReportsRoute: {
        to: "/admin/reports",
        build: (options) => interpolatePath("/admin/reports", undefined, options?.search, options?.hash),
    },
};
// PUBLIC API
export { Link } from './Link';
// PUBLIC API
export { NavLink } from './NavLink';
//# sourceMappingURL=index.js.map