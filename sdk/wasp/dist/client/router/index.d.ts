import type { RouteDefinitionsToRoutes, OptionalRouteOptions } from './types';
export declare const routes: {
    readonly RootRoute: {
        readonly to: "/";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly LoginRoute: {
        readonly to: "/login";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly ParentDashboardRoute: {
        readonly to: "/parent/dashboard";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly POSCheckoutRoute: {
        readonly to: "/pos/checkout";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
    readonly AdminReportsRoute: {
        readonly to: "/admin/reports";
        readonly build: (options?: OptionalRouteOptions) => string;
    };
};
export type Routes = RouteDefinitionsToRoutes<typeof routes>;
export { Link } from './Link';
export { NavLink } from './NavLink';
//# sourceMappingURL=index.d.ts.map