import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, createRoute, createRouter } from '@tanstack/react-router';

import { locationValues, queryClient } from 'context';

// ROUTER NOT HOOKED UP YET OR IN USE ANYWHERE IN APP

// https://tanstack.com/router/latest/docs/framework/react/examples/basic-react-query
// https://tanstack.com/router/latest/docs/framework/react/guide/code-based-routing

const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()();
// ({
//   component: RootComponent,
// });

// function RootComponent() {
//   return <div>temp</div>
// }

// TODO: search route --> validate search params
// hide from displaying in url ??

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexRouteComponent,
  validateSearch: (search) => locationValues.parse(search),
});

function IndexRouteComponent() {
  return (
    <div className='p-2'>
      <h3>Welcome Home!</h3>
    </div>
  );
}

export const routeTree = rootRoute.addChildren([indexRoute]);

// const photoModalToPhotoMask = createRouteMask({
//   routeTree,
//   from: '/photos/$photoId/modal',
//   to: '/photos/$photoId',
//   params: (prev) => ({
//     photoId: prev.photoId,
//   }),
// });

export const router = createRouter({
  routeTree,
  // routeMasks: [photoModalToPhotoMask],
  context: {
    queryClient,
  },
});

// export {}
