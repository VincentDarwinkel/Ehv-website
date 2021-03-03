import React, { Component } from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "./index.css";

export default class RegistrationSuccess extends Component {
  render() {
    return (
      <div className="content" id="registration-success">
        <div className="ehv-card fade-down">
          <h5>Welkom</h5>
          <p>
            Wat leuk dat je je hebt geregistreerd. Om te beginnen moeten we eerst je account activeren. Er is een email naar het email adres gestuurd
            wat je hebt ingevuld. In deze email staat een link die jouw account activeert. Nadat dit is gedaan is je account geactiveerd en kun je
            gebruik maken van de mooie functionaliteiten van de website.
          </p>
          <p>Veel plezier met het gebruik van de Eindhoven Vrienden Website!</p>
          <a href="https://www.linkedin.com/in/vincent-darwinkel/">
            <small style={{ cursor: "pointer" }}>Door: Vincent Darwinkel</small>
          </a>
        </div>
      </div>
    );
  }
}
