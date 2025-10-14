import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const azureVmPlugin = createPlugin({
  id: 'azure-vm',
  routes: {
    root: rootRouteRef,
  },
});

export const AzureVmPage = azureVmPlugin.provide(
  createRoutableExtension({
    name: 'AzureVmPage',
    component: () =>
      import('./components/AzureVmPage').then(m => m.AzureVmPage),
    mountPoint: rootRouteRef,
  }),
);