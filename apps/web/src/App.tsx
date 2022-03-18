import "reflect-metadata";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAccessToken } from "./libs";
import { AuthRoute } from "./libs/routes";
import { routes } from "./pages/routes";
import smoothscroll from "smoothscroll-polyfill";

function App() {
  smoothscroll.polyfill();

  const { data, isLoading } = useAccessToken();

  return (
    <>
      <BrowserRouter>
        <Switch>
          {routes.map((route) =>
            route.authRequired === true ? (
              isLoading ? (
                <></>
              ) : (
                <AuthRoute
                  authenticated={data != null}
                  path={route.path}
                  render={() => (
                    <>
                      <route.component />
                      <Helmet title={route.title} />
                    </>
                  )}
                  exact={route.exact}
                  title={route.title}
                />
              )
            ) : (
              <Route
                path={route.path}
                exact={route.exact}
                render={() => (
                  <>
                    <route.component />
                    <Helmet title={route.title} />
                  </>
                )}
              />
            )
          )}
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
