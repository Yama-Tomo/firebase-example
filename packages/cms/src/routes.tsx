import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

const routes = {
  home: '/',
  article: {
    new: '/article/new',
  },
};

type LazyComponentCreatorType = (Component: React.ComponentType) => React.FCX<RouteComponentProps>;

const LazyComponentCreator: LazyComponentCreatorType = (Component) => (props) => (
  <React.Suspense fallback={<div>loading....</div>}>
    <Component {...props} />
  </React.Suspense>
);

export const Routes: React.FCX = (props) =>
  // prettier-ignore
  <Switch>
    <Route exact path={routes.home} component={LazyComponentCreator( React.lazy(() => import('./pages/Home')) )} />
    <Route exact path={routes.article.new} component={LazyComponentCreator( React.lazy(() => import('./pages/Articles/New')) )} />
    <Route component={LazyComponentCreator( React.lazy(() => import('./pages/Error404')) )} />
  </Switch>;

export default routes;
