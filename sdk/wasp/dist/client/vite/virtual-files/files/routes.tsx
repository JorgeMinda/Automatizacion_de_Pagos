import { getRouteObjects } from "wasp/client/app/router";
import { initializeQueryClient } from "wasp/client/operations";

import { createAuthRequiredPage } from "wasp/client/app"

import { App as App_ext } from './src/client/App'



const routesMapping = {
  RootRoute: {
    lazy: async () => {
      const Component = await import('./src/client/pages/LandingPage').then(m => m.LandingPage);

      return {
        Component:
          Component,
      }
    },
  },
  LoginRoute: {
    lazy: async () => {
      const Component = await import('./src/client/pages/LoginPage').then(m => m.LoginPage);

      return {
        Component:
          Component,
      }
    },
  },
  ParentDashboardRoute: {
    lazy: async () => {
      const Component = await import('./src/client/pages/ParentDashboardPage').then(m => m.ParentDashboardPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  POSCheckoutRoute: {
    lazy: async () => {
      const Component = await import('./src/client/pages/POSCheckoutPage').then(m => m.POSCheckoutPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
  AdminReportsRoute: {
    lazy: async () => {
      const Component = await import('./src/client/pages/AdminReportsPage').then(m => m.AdminReportsPage);

      return {
        Component:
          createAuthRequiredPage(Component),
      }
    },
  },
} as const;


initializeQueryClient()

const rootElement =
  // We don't really need to wrap the app in a div nor name it "root", but we
  // keep it for backwards compatibility with older Wasp versions.
  <div id="root">
    <App_ext />
  </div>

export const routeObjects = getRouteObjects({
  routesMapping,
  rootElement,
})
