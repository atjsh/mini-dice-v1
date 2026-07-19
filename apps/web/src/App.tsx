import { Helmet } from 'react-helmet';
import {
  Navigate,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from 'react-router-dom';
import 'reflect-metadata';
import { useEffect, useMemo } from 'react';
import { useUser } from './libs';
import {
  onlineStatusTracker,
  pushNotificationManager,
} from './libs/push-notification';
import { IndexSkeletonPage } from './pages/IndexSkeleton';
import {
  FinishSignupPageURL,
  IndexPageURL,
  ProtectedRoute,
  ServicePageURL,
  protectedRoutes,
} from './pages/routes';

const Route: React.FC<{ route: ProtectedRoute }> = ({ route }) => {
  return (
    <>
      <ScrollRestoration />
      <Helmet title={route.title} />
      <route.component />
    </>
  );
};

function App() {
  const { isError: isNotAuthed, data: user, isLoading } = useUser();

  useEffect(() => {
    if (!user) {
      onlineStatusTracker.stopTracking();
      return;
    }

    pushNotificationManager
      .isPushSubscribed()
      .then((isSubscribed) => {
        if (isSubscribed) {
          onlineStatusTracker.startTracking();
        }
      })
      .catch(() => {
        onlineStatusTracker.stopTracking();
      });
  }, [user?.id]);

  const router = useMemo(
    () =>
      createBrowserRouter(
        protectedRoutes.map((route) => ({
          path: route.path,
          element: isLoading ? (
            <IndexSkeletonPage />
          ) : route.protection == 'notAuthed' ? (
            isNotAuthed ? (
              <Route route={route} />
            ) : (
              <Navigate
                to={{
                  pathname: ServicePageURL,
                }}
                replace
              />
            )
          ) : route.protection == 'authed' ? (
            isNotAuthed ? (
              <Navigate
                to={{
                  pathname: ServicePageURL,
                }}
                replace
              />
            ) : (
              <Route route={route} />
            )
          ) : route.protection == 'signupCompleted' ? (
            user?.signupCompleted == true ? (
              <Route route={route} />
            ) : user ? (
              <Navigate
                to={{
                  pathname: FinishSignupPageURL,
                }}
                replace
              />
            ) : (
              <Navigate
                to={{
                  pathname: IndexPageURL,
                  search: '?loginRequired=true',
                }}
                replace
              />
            )
          ) : route.protection == 'signupNotCompleted' ? (
            user?.signupCompleted == false ? (
              <Route route={route} />
            ) : (
              <Navigate
                to={{
                  pathname: ServicePageURL,
                }}
                replace
              />
            )
          ) : (
            <Route route={route} />
          ),
        })),
      ),
    [isLoading, isNotAuthed, user?.signupCompleted],
  );

  return <RouterProvider router={router} />;
}

export default App;
