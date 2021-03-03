import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import { getClaim } from "services/jwt";
import paths from "services/shared/router-paths";

const ProtectedRoute = ({ component: Component, user, roles, ...rest }) => {
  const jwt = new Cookies()?.get("Jwt")?.jwt;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (jwt !== undefined && roles.includes(getClaim("AccountRole"))) {
          return <Component {...rest} {...props} />;
        }

        return (
          <Redirect
            to={{
              pathname: paths.Login,
              state: {
                from: props.location,
              },
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
