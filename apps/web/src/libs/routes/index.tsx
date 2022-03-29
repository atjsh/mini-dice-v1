import { Redirect, Route } from 'react-router-dom';
import { IndexPageURL } from '../../pages/routes';

export function AuthRoute({ authenticated, render, redirectTo, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          render(props)
        ) : (
          <Redirect
            to={{
              pathname: String(redirectTo),
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
