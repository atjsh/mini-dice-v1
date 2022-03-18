import { Redirect, Route } from "react-router-dom";
import { LoginPageURL } from "../../pages/routes";

export function AuthRoute({
  authenticated,
  component: Component,
  render,
  ...rest
}: any) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          render ? (
            render(props)
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{ pathname: LoginPageURL, state: { from: props.location } }}
          />
        )
      }
    />
  );
}
