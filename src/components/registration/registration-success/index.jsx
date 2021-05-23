import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { getFormDataObject } from "services/shared/form-data-helper";
import paths from "services/shared/router-paths";
import { ActivateUser } from "services/user";
import "./index.css";

export default class RegistrationSuccess extends Component {
  onSubmit = async (e) => {
    e.preventDefault();
    const formData = getFormDataObject(e);
    const result = await ActivateUser(formData.code);
    if (result.status === 200) {
      toast.success("Activatie gelukt, je wordt over 5 seconden naar de loginpagina doorgestuurd");
      setTimeout(function () {
        window.location.href = paths.Login;
      }, 5000);
      return;
    }

    toast.error("Code is niet geldig");
  };

  render() {
    return (
      <div className="content" id="registration-success">
        <div className="ehv-card fade-down">
          <h5>Welkom</h5>
          <p>
            Bedankt voor het registreren! Om te beginnen moeten we eerst je account activeren. Er is een email naar het email adres gestuurd wat je
            hebt ingevuld. In deze email staat een code die je hieronder invoert. Nadat dit is gedaan is je account geactiveerd en kun je inloggen.
          </p>
          <p>Veel plezier met het gebruik van de Eindhovense vriendjes Website!</p>
          <Form onSubmit={this.onSubmit}>
            <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control name="code" placeholder="Code" />
            </Form.Group>
            <Button type="submit">Activeren</Button>
          </Form>
          <br />
          <a href="https://www.linkedin.com/in/vincent-darwinkel/">
            <small style={{ cursor: "pointer" }}>Door: Vincent Darwinkel</small>
          </a>
        </div>
      </div>
    );
  }
}
