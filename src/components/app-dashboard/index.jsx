import React from "react";
import "./index.css";
import App from "./app-card";
import { Component } from "react";
import Header from "components/shared/header";
import accountRole from "services/shared/account-role";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import routerPaths from "services/shared/router-paths";

export default class AppDashboard extends Component {
  generateApps = () => {
    const userRole = getClaim(jwtClaims.accountRole);
    const apps = [
      {
        app: <App href={routerPaths.Users} img={<i className="fas fa-users" />} appName="Gebruikers" />,
        accountRoles: [accountRole.User, accountRole.Admin, accountRole.SiteAdmin],
      },
      {
        app: <App href={routerPaths.Events} img={<i className="far fa-calendar-alt" />} appName="Evenementen" />,
        accountRoles: [accountRole.User, accountRole.Admin, accountRole.SiteAdmin],
      },
      {
        app: <App href={routerPaths.DatePickers} img={<i className="fas fa-thumbtack" />} appName="Datum prikker" />,
        accountRoles: [accountRole.User, accountRole.Admin, accountRole.SiteAdmin],
      },
      {
        app: <App href={routerPaths.Gallery} img={<i className="fas fa-photo-video" />} appName="Gallerij" />,
        accountRoles: [accountRole.User, accountRole.Admin, accountRole.SiteAdmin],
      },
    ];

    const appsToRender = [];
    apps.forEach((link) => {
      if (link.accountRoles.includes(userRole)) {
        appsToRender.push(link.app);
      }
    });

    return appsToRender;
  };

  render() {
    return (
      <div id="apps">
        <Header pageName="Apps" />
        <div className="fade-down content">
          <div className="app-cards" id="apps-overview">
            {this.generateApps()}
          </div>
        </div>
      </div>
    );
  }
}
