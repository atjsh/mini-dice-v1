import { Helmet } from 'react-helmet';
import {
  Navigate,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from 'react-router-dom';
import 'reflect-metadata';
import { useUser } from './libs';
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

  const router = createBrowserRouter(
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
  );

  return <RouterProvider router={router} />;
}

export default App;
