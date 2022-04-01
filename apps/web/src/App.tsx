import { Helmet } from 'react-helmet';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import 'reflect-metadata';
import smoothscroll from 'smoothscroll-polyfill';
import { useUser } from './libs';
import { IndexPage } from './pages/Index.page';
import { IndexSkeletonPage } from './pages/IndexSkeleton';
import {
  FinishSignupPageURL,
  IndexPageURL,
  protectedRoutes,
  ServicePageURL,
} from './pages/routes';

function App(props) {
  smoothscroll.polyfill();

  const { isError: isNotAuthed, data: user, isLoading } = useUser();

  return (
    <>
      {isLoading ? (
        <>
          <BrowserRouter>
            <Switch>
              <Route>
                <IndexSkeletonPage />
              </Route>
            </Switch>
          </BrowserRouter>
        </>
      ) : (
        <BrowserRouter>
          <Switch>
            {protectedRoutes.map((route) => (
              <Route
                path={route.path}
                exact={route.exact}
                render={() =>
                  route.protection == 'notAuthed' ? (
                    isNotAuthed ? (
                      <>
                        <Helmet title={route.title} />
                        <route.component />
                      </>
                    ) : (
                      <Redirect
                        to={{
                          pathname: ServicePageURL,
                          state: { from: props.location },
                        }}
                      />
                    )
                  ) : route.protection == 'authed' ? (
                    isNotAuthed == true ? (
                      <Redirect
                        to={{
                          pathname: ServicePageURL,
                          state: { from: props.location },
                        }}
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
                      <Redirect
                        to={{
                          pathname: FinishSignupPageURL,
                          state: { from: props.location },
                        }}
                      />
                    ) : (
                      <Redirect
                        to={{
                          pathname: IndexPageURL,
                          search: '?loginRequired=true',
                          state: { from: props.location },
                        }}
                      />
                    )
                  ) : route.protection == 'signupNotCompleted' ? (
                    user?.signupCompleted == false ? (
                      <>
                        <Helmet title={route.title} />
                        <route.component />
                      </>
                    ) : (
                      <Redirect
                        to={{
                          pathname: ServicePageURL,
                          state: { from: props.location },
                        }}
                      />
                    )
                  ) : (
                    <>
                      <Helmet title={route.title} />
                      <route.component />
                    </>
                  )
                }
              />
            ))}
          </Switch>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
