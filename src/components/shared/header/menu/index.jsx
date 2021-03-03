import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { getClaim } from "services/jwt";
import accountRole from "services/shared/account-role";
import jwtClaims from "services/shared/jwt-claims";
import routerPaths from "services/shared/router-paths";
import Cookies from "universal-cookie";
import "./index.css";

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuLinks: [],
    };
  }

  openNav = () => {
    const menu = document.getElementById("menu");
    menu.style.width = "125px";
  };

  closeNav = () => {
    const menu = document.getElementById("menu");
    menu.style.width = "0";
  };

  logout = () => {
    const cookie = new Cookies();
    cookie.remove("Jwt", { path: "/" });
    window.location.pathname = "/login";
  };

  generateLinks = () => {
    const userRole = getClaim(jwtClaims.accountRole);
    const links = [
      {
        a: (
          <a key="menu-dashboard" href={routerPaths.Dashboard}>
            <i className="fas fa-tachometer-alt" />
            Dashboard
          </a>
        ),
        accountRoles: [accountRole.User, accountRole.Admin, accountRole.SiteAdmin],
      },
      {
        a: (
          <a key="menu-apps" href={routerPaths.AppDashboard}>
            <i className="fas fa-th" />
            Apps
          </a>
        ),
        accountRoles: [accountRole.User, accountRole.Admin, accountRole.SiteAdmin],
      },
    ];

    return links.filter((link) => link.accountRoles.includes(userRole)).map((link) => link.a);
  };

  render() {
    return (
      <div>
        <Button id="open-menu-button" className="link-btn corporate-identity-font" type="button" onClick={this.openNav}>
          &#9776;
        </Button>

        <div id="menu">
          <button className="closebtn link-btn" type="button" onClick={this.closeNav}>
            &times;
          </button>
          <div id="menu-links">
            {this.generateLinks()}
            <button onClick={() => this.logout()} type="button" className="link-btn">
              <i className="fas fa-sign-out-alt" />
              Afmelden
            </button>
          </div>
        </div>
      </div>
    );
  }
}
