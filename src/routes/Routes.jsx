import { BrowserRouter, Redirect, Route } from "react-router-dom";
import React, { Suspense } from "react";
import routerPaths from "services/shared/router-paths";
import accountRoles from "services/shared/account-role";
import Login from "components/login/";
import Registration from "components/registration";
import RegistrationSuccess from "components/registration/registration-success";

import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "components/dashboard/";
import AppDashboard from "components/app-dashboard";
import Users from "components/users/";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import Gallery from "components/gallery";

function getSiteAdminRoutes() {
  return (
    <span>
      <Suspense fallback={<div>Loading admin component</div>}>
        <ProtectedRoute
          roles={[accountRoles.SiteAdmin]}
          exact
          path={routerPaths.Account}
          component={React.lazy(() => import("components/account"))}
        />
      </Suspense>
    </span>
  );
}

function getAdminRoutes() {
  return (
    <span>
      <Suspense fallback={<div>Loading admin component</div>}>
        <ProtectedRoute
          roles={[accountRoles.Admin]}
          exact
          path={routerPaths.Events}
          component={React.lazy(() => import("components/events/all-events"))}
        />
        <ProtectedRoute roles={[accountRoles.Admin]} exact path={routerPaths.Account} component={React.lazy(() => import("components/account"))} />
        <ProtectedRoute roles={[accountRoles.Admin]} exact path={routerPaths.Event} component={React.lazy(() => import("components/events/event"))} />
        <ProtectedRoute
          roles={[accountRoles.Admin]}
          exact
          path={routerPaths.DatePickers}
          component={React.lazy(() => import("components/datepickers/all-datepickers"))}
        />
        <ProtectedRoute
          roles={[accountRoles.Admin]}
          exact
          path={routerPaths.EditDatepicker}
          component={React.lazy(() => import("components/datepickers/edit-datepicker"))}
        />
        <ProtectedRoute
          roles={[accountRoles.Admin]}
          exact
          path={routerPaths.AddDatepicker}
          component={React.lazy(() => import("components/datepickers/add-datepicker"))}
        />
        <ProtectedRoute
          roles={[accountRoles.Admin]}
          exact
          path={routerPaths.DatePickerStatus}
          component={React.lazy(() => import("components/datepickers/datepicker-status"))}
        />
      </Suspense>
    </span>
  );
}

function getUserRoutes() {
  return (
    <span>
      <Suspense fallback={<div>Loading component</div>}>
        <ProtectedRoute
          roles={[accountRoles.User]}
          exact
          path={routerPaths.Events}
          component={React.lazy(() => import("components/events/all-events"))}
        />
        <ProtectedRoute roles={[accountRoles.User]} exact path={routerPaths.Account} component={React.lazy(() => import("components/account"))} />
        <ProtectedRoute roles={[accountRoles.User]} exact path={routerPaths.Event} component={React.lazy(() => import("components/events/event"))} />
        <ProtectedRoute
          roles={[accountRoles.User]}
          exact
          path={routerPaths.DatePickers}
          component={React.lazy(() => import("components/datepickers/all-datepickers"))}
        />
        <ProtectedRoute
          roles={[accountRoles.User]}
          exact
          path={routerPaths.EditDatepicker}
          component={React.lazy(() => import("components/datepickers/edit-datepicker"))}
        />
        <ProtectedRoute
          roles={[accountRoles.User]}
          exact
          path={routerPaths.DatePickerAvailability}
          component={React.lazy(() => import("components/datepickers/datepicker-availability"))}
        />
        <ProtectedRoute
          roles={[accountRoles.User]}
          exact
          path={routerPaths.DatePickerStatus}
          component={React.lazy(() => import("components/datepickers/datepicker-status"))}
        />
      </Suspense>
    </span>
  );
}

const accountRole = getClaim(jwtClaims.accountRole);

function routes() {
  return (
    <BrowserRouter>
      <Route exact path={routerPaths.Root}>
        <Redirect to={routerPaths.Login} />
      </Route>
      <Route exact path={routerPaths.Login} component={Login} />
      <Route exact path={routerPaths.Registration} component={Registration} />
      <Route exact path={routerPaths.RegistrationSuccess} component={RegistrationSuccess} />
      <ProtectedRoute roles={[accountRoles.User, accountRoles.Admin, accountRoles.SiteAdmin]} exact path={routerPaths.Gallery} component={Gallery} />
      <ProtectedRoute
        roles={[accountRoles.User, accountRoles.Admin, accountRoles.SiteAdmin]}
        exact
        path={routerPaths.Dashboard}
        component={Dashboard}
      />
      {accountRole === accountRoles.SiteAdmin ? getSiteAdminRoutes() : null}
      {accountRole === accountRoles.Admin ? getAdminRoutes() : null}
      {accountRole === accountRoles.User ? getUserRoutes() : null}

      <ProtectedRoute
        roles={[accountRoles.User, accountRoles.Admin, accountRoles.SiteAdmin]}
        exact
        path={routerPaths.AppDashboard}
        component={AppDashboard}
      />
      <ProtectedRoute roles={[accountRoles.User, accountRoles.Admin, accountRoles.SiteAdmin]} exact path={routerPaths.Users} component={Users} />
    </BrowserRouter>
  );
}

export default routes;
