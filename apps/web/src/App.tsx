import { Helmet } from 'react-helmet';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import 'reflect-metadata';
import { useUser } from './libs';
import { IndexSkeletonPage } from './pages/IndexSkeleton';
import {
  FinishSignupPageURL,
  IndexPageURL,
  ServicePageURL,
  protectedRoutes,
} from './pages/routes';

function App() {
  const { isError: isNotAuthed, data: user, isLoading } = useUser();
  console.log('app redraw', user);

  const router = createBrowserRouter(
    protectedRoutes.map((route) => ({
      path: route.path,
      element: isLoading ? (
        <IndexSkeletonPage />
      ) : route.protection == 'notAuthed' ? (
        isNotAuthed ? (
          <>
            <Helmet title={route.title} />
            <route.component />
          </>
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
          <>
            <Helmet title={route.title} />
            <route.component />
          </>
        )
      ) : route.protection == 'signupCompleted' ? (
        user?.signupCompleted == true ? (
          <>
            <Helmet title={route.title} />
            <route.component />
          </>
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
          <>
            <Helmet title={route.title} />
            <route.component />
          </>
        ) : (
          <Navigate
            to={{
              pathname: ServicePageURL,
            }}
            replace
          />
        )
      ) : (
        <>
          <Helmet title={route.title} />
          <route.component />
        </>
      ),
    })),
  );

  return <RouterProvider router={router} />;
}

export default App;
