import { Button, Form } from "react-bootstrap";
import "./index.css";
import { LoginUser } from "services/user";
import React, { Component } from "react";
import { toast } from "react-toastify";
import routerPaths from "services/shared/router-paths";
import { getFormDataObject, toggleSpinner } from "services/shared/form-data-helper";
import { setAuthorizationCookie } from "services/shared/cookie";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      multiRoleData: null,
    };
  }

  setJwt = (jwt, refreshToken) => {
    setAuthorizationCookie({
      jwt,
      refreshToken,
    });
    window.location.pathname = routerPaths.Dashboard;
  };

  submitForm = async (e) => {
    e.preventDefault();
    toggleSpinner("login-spinner", "login-submit-btn");

    let formData = getFormDataObject(e);
    formData.loginCode = Number(formData.loginCode);
    const result = await LoginUser(formData);

    if (result.status === 200) {
      const data = await result.json();

      if (this.state.multiRoleData !== null && data?.jwt !== undefined) {
        this.setJwt(data.jwt, data.refreshToken);
        return;
      } else if (data?.userHasMultipleAccountRoles) {
        this.setState({ multiRoleData: data });
        toggleSpinner("login-spinner", "login-submit-btn");
        return;
      }
      this.setJwt(data.jwt, data.refreshToken);
    } else if (result.status === 401) {
      toast.error("Verkeerde gebruikersnaam of wachtwoord");
    } else if (result.status === 403) {
      toast.error("Dit account is uitgeschakeld, neem contact op met de beheerder");
    }

    toggleSpinner("login-spinner", "login-submit-btn");
  };

  render() {
    return (
      <section id="login">
        <div className="fade-down">
          <h1 className="text-center">Welkom Eindhovense vriendjes</h1>
          <Form className="card" id="login-form" onSubmit={this.submitForm}>
            <h6>{this.test2}</h6>
            <h3 className="text-center">Login</h3>
            <Form.Control className="mb-1" autoFocus type="text" placeholder="Gebruikersnaam" minLength="4" name="username" required />
            <Form.Control className="mb-1" type="password" placeholder="Wachtwoord" minLength="8" name="password" required />
            <Form.Group hidden={this.state.multiRoleData === null}>
              <Form.Label>Gebruikersrol selecteren:</Form.Label>
              <Form.Control as="select" name="selectedAccountRole">
                {this.state.multiRoleData?.selectableAccountRoles.map((sa) => (
                  <option value={sa}>{sa}</option>
                ))}
              </Form.Control>
              <Form.Control name="loginCode" type="number" min="99999" max="999999" placeholder="Login code (kijk email)" />
            </Form.Group>
            <Button block type="submit" variant="secondary" id="login-submit-btn">
              Login
              <span className="spinner-border spinner-border-sm form-spinner" id="login-spinner" role="status" />
            </Button>

            <div id="login-actions">
              <a href={routerPaths.Registration} id="login-register">
                <i className="far fa-edit" />
                {" Registreren"}
              </a>
              <br />
              <a href={routerPaths.ForgotPassword}>
                <i className="fas fa-key" />
                {" Wachtwoord vergeten"}
              </a>
            </div>
          </Form>
          <h6 id="author">
            Door:
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/vincent-darwinkel/">
              Vincent Darwinkel
            </a>
          </h6>
        </div>
      </section>
    );
  }
}
