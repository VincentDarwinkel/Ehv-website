import "components/shared/loading/index.css";
import React, { Component } from "react";
import { Button, Collapse, Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { GetArtists } from "services/artists";
import { GetHobbies } from "services/hobbies";
import "./index.css";
import { getFormDataObject } from "services/shared/form-data-helper";
import { RegisterUser } from "services/user";
import paths from "services/shared/router-paths";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.cropper = React.createRef();

    this.state = {
      selectableHobbies: [],
      selectedHobbies: [],
      selectableArtists: [],
      selectedArtists: [],
      uploadedImage: null,
      croppedImage: null,
      termsAndConditionOpen: false,
    };
  }

  componentDidMount = async () => {
    const hobbyResult = await GetHobbies();
    const artistResult = await GetArtists();

    if (hobbyResult.status === 200 && artistResult.status === 200) {
      const selectableHobbies = (await hobbyResult.json()).map((h) => h.name);
      const selectableArtists = (await artistResult.json()).map((h) => h.name);

      this.setState({
        selectableHobbies,
        selectableArtists,
      });
    }
  };

  formValid = (formData) => {
    if (formData.password !== formData["repeat-password"]) {
      toast.error("Wachtwoorden komen niet overeen");
      return false;
    }

    return true;
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { selectedArtists, selectedHobbies } = this.state;
    let formData = getFormDataObject(e);
    formData.receiveEmail = formData.receiveEmail === "on";

    formData.hobbies = selectedHobbies.map((sh) => ({ hobby: sh }));
    formData.favoriteArtists = selectedArtists.map((sa) => ({ artist: sa }));

    if (!this.formValid(formData)) {
      return;
    }

    const result = await RegisterUser(formData);
    if (result.status === 200) {
      window.location = paths.RegistrationSuccess;
    } else if (result.status === 409) {
      toast.error("Er bestaat al een gebruiker met dit email adres of gebruikersnaam");
    }
  };

  render() {
    return (
      <div className="content" id="registration">
        <div id="registration-form-wrapper" className="ehv-card">
          <Form onSubmit={this.onSubmit}>
            <h1 className="text-center">Registeren</h1>
            <br />
            <p className="text-center">Verplichte velden</p>
            <hr />
            <Form.Group>
              <Form.Label>Gebruikersnaam:</Form.Label>
              <Form.Control type="text" name="username" placeholder="Gebruikersnaam" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Biologisch geslacht:</Form.Label>
              <Form.Control as="select" name="gender" required>
                <option value="male">Man</option>
                <option value="female">Vrouw</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Geboortedatum:</Form.Label>
              <Form.Control type="date" name="birthdate" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" name="email" placeholder="Email" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Wachtwoord:</Form.Label>
              <Form.Control type="password" name="password" placeholder="Wachtwoord" required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Herhaal wachtwoord:</Form.Label>
              <Form.Control type="password" name="repeat-password" placeholder="Herhaal wachtwoord" required />
            </Form.Group>
            <hr />
            <p className="text-center">
              Optionele velden
              <br />
              <small>Deze velden zijn niet verplicht, maar kunnen anderen wel helpen om jou beter te leren kennen</small>
            </p>
            <Form.Group>
              <Form.Label>Over mij:</Form.Label>
              <Form.Control as="textarea" type="text" name="about" placeholder="Mijn passie is..." />
            </Form.Group>
            <Form.Group>
              <Form.Label>Hobbies:</Form.Label>
              <br />
              <small>{`${this.state.selectableHobbies.length} opties`}</small>
              <Typeahead
                id="registration-hobbies"
                multiple={true}
                options={this.state.selectableHobbies}
                onChange={(e) => this.setState({ selectedHobbies: e })}
                placeholder="Stappen, film kijken"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Favorieten artiesten:</Form.Label>
              <br />
              <small>{`${this.state.selectableArtists.length} opties`}</small>
              <Typeahead
                id="registration-artist"
                multiple={true}
                options={this.state.selectableArtists}
                onChange={(e) => this.setState({ selectedArtists: e })}
                placeholder="Armin van Buuren, Lady Gaga"
              />
            </Form.Group>
            <Form.Group controlId="registration-receive-email">
              <Form.Label>Emails ontvangen:</Form.Label>
              <Form.Check id="registration-receive-email" name="receiveEmail" defaultChecked type="checkbox" label="Emails ontvangen" />
            </Form.Group>

            <b
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => this.setState({ termsAndConditionOpen: !this.state.termsAndConditionOpen })}
              aria-controls="collapse-text"
              aria-expanded={this.state.termsAndConditionOpen}
            >
              Algemene voorwaarden {this.state.termsAndConditionOpen ? <i className="fas fa-sort-up" /> : <i className="fas fa-sort-down" />}
            </b>
            <Collapse in={this.state.termsAndConditionOpen}>
              <p id="collapse-text">
                Door de algemene voorwaarden te accepteren ga ik akkoord met het volgende:
                <br />
                1. Ik gedraag mij netjes tegen andere gebruikers van de website
                <br />
                2. Ik ga niet zonder overleg met de eigenaar van de website of bijbehorende server infrastructuur testen op beveiligingsproblemen
                <br />
                3. Ik upload geen media zoals: (kinder)porno, haatzaaiende media, kwetsende media
                <br />
                4. Ik upload alleen media die betrekking heeft tot de Eindhovense vrienden groep
                <br />
                5. Ik lek geen afgeschermde gegevens uit
                <br />
                6. Ik voer geen aanvallen uit op de website of bijbehorende server infrastructuur
                <br />
                7. Indien ik een of meerdere regels overtreed ga ik akkoord met het volgende:
                <br />
                - Mijn account kan worden uitgeschakeld
                <br />
                - Er kan melding bij de politie worden gedaan
                <br />
                - Eventuele gegevens kunnen worden verwijderd door de beheerder(s)
                <br />
              </p>
            </Collapse>

            <Form.Group controlId="registration-terms-and-conditions">
              <Form.Check required id="registration-terms-and-conditions" type="checkbox" label="Ik accepteer de algemene voorwaarden" />
            </Form.Group>
            <Button block type="submit" id="registration-submit-btn">
              Registreren
              <span className="spinner-border spinner-border-sm form-spinner" id="registration-spinner" role="status" />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
