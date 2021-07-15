import React, { Component } from "react";
import "./index.css";
import { GetHobbies } from "services/hobbies";
import { GetArtists } from "services/artists";
import { GetUsersByUuid, RemoveUserAccountInfo, UpdateUser } from "services/user";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import Header from "components/shared/header";
import ReactModal from "components/shared/modal";
import { Form, Button } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { createGuid, getFormDataObject } from "services/shared/form-data-helper";
import { toast } from "react-toastify";
import Loading from "components/shared/loading";
import Cookies from "universal-cookie";

class Account extends Component {
  constructor(props) {
    super(props);

    const userPlaceholder = {
      username: "",
      about: "",
      hobbies: [],
      favoriteArtists: [],
      genderSelect: null,
    };

    this.state = {
      selectedArtists: [],
      selectedHobbies: [],
      selectableArtists: [],
      selectableHobbies: [],
      user: userPlaceholder,
      modalOptions: {
        description: null,
        show: false,
        callback: null,
        close: () => {
          let modalOptions = this.state.modalOptions;
          modalOptions.show = false;
          this.setState({ modalOptions });
        },
      },
    };
  }

  componentDidMount = async () => {
    const userUuid = getClaim(jwtClaims.uuid);
    const userData = await GetUsersByUuid([userUuid]);
    const hobbyResult = await GetHobbies();
    const artistResult = await GetArtists();
    const user = (await userData.json())[0];

    if (userData.status === 200 && hobbyResult.status === 200 && artistResult.status === 200 && user?.email !== undefined) {
      const selectableHobbies = (await hobbyResult.json()).map((h) => h.name);
      const selectableArtists = (await artistResult.json()).map((h) => h.name);
      const selectedHobbies = user?.hobbies?.map((h) => h.hobby);
      const selectedArtists = user?.favoriteArtists?.map((a) => a.artist);

      this.setState({
        selectedHobbies,
        selectedArtists,
        user: user,
        selectableArtists,
        selectableHobbies,
      });
    }
  };

  validateForm = (formData) => {
    if (formData.newPassword !== formData.repeatPassword) {
      toast.error("Wachtwoorden komen niet overeen");
      return false;
    }

    return true;
  };

  onSubmit = async (e) => {
    e.preventDefault();

    const { selectedArtists, selectedHobbies, user } = this.state;
    const userUuid = getClaim(jwtClaims.uuid);
    let formData = getFormDataObject(e);
    formData.receiveEmail = formData.receiveEmail === "on";

    const formValid = this.validateForm(formData);
    if (!formValid) {
      return;
    }

    if (selectedHobbies.length > 0 || selectedArtists.length > 0) {
      formData.hobbies = selectedHobbies.map((hobby) => ({
        uuid: createGuid(),
        userUuid,
        hobby,
      }));
      formData.favoriteArtists = selectedArtists.map((artist) => ({ uuid: createGuid(), userUuid, artist }));
    } else {
      formData.hobbies = user.hobbies;
      formData.favoriteArtists = user.favoriteArtists;
    }

    const result = await UpdateUser(formData);
    if (result.status === 200) {
      toast.success("Account aangepast");
      return;
    }
    if (result.status === 401) {
      toast.error("Onjuist wachtwoord ingevoerd");
    }
  };

  removeAccount = async () => {
    const options = ["userData", "datepickerData", "eventData", "mediaData"]; // temp let user select this in production
    const result = await RemoveUserAccountInfo(options);
    if (result.status === 200) {
      const cookie = new Cookies();
      cookie.remove("Jwt", { path: "/" });
      window.location.pathname = "/login";
    }
  };

  render() {
    const { modalOptions, selectableHobbies, selectableArtists, user, selectedArtists, selectedHobbies } = this.state;

    return (
      <div>
        <Header loading={user.email === undefined} pageName="Account" />
        <ReactModal modalOptions={modalOptions} />
        <div className="fade-down content" id="account">
          <div className="ehv-card">
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>Gebruikersnaam:</Form.Label>
                <Form.Control type="text" name="username" defaultValue={user?.username} placeholder="Gebruikersnaam" required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" name="email" defaultValue={user?.email} placeholder="Email" required />
              </Form.Group>
              <br />
              <p className="text-center">Wachtwoord wijzigen</p>
              <hr />
              <Form.Group>
                <Form.Label>Nieuw Wachtwoord:</Form.Label>
                <Form.Control type="password" name="newPassword" placeholder="Wachtwoord" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Herhaal wachtwoord:</Form.Label>
                <Form.Control type="password" name="repeatPassword" placeholder="Herhaal wachtwoord" />
              </Form.Group>
              <hr />
              <p className="text-center">
                Optionele velden
                <br />
                <small>Deze velden zijn niet verplicht, maar kunnen anderen wel helpen om jou beter te leren kennen</small>
              </p>
              <Form.Group>
                <Form.Label>Over mij:</Form.Label>
                <Form.Control as="textarea" type="text" name="about" defaultValue={user?.about} placeholder="Mijn passie is..." />
              </Form.Group>
              <Form.Group>
                <Form.Label>Hobbies:</Form.Label>
                <br />
                <small>{`${selectableHobbies?.length} opties`}</small>
                <Typeahead
                  key={createGuid()}
                  id={createGuid()}
                  multiple={true}
                  options={selectableHobbies}
                  defaultSelected={selectedHobbies}
                  onChange={(e) => this.setState({ selectedHobbies: e })}
                  placeholder="Stappen, film kijken"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Favorieten artiesten:</Form.Label>
                <br />
                <small>{`${selectableArtists?.length} opties`}</small>
                <Typeahead
                  key={createGuid()}
                  id={createGuid()}
                  multiple={true}
                  options={selectableArtists}
                  defaultSelected={selectedArtists}
                  onChange={(e) => this.setState({ selectedArtists: e })}
                  placeholder="Armin van Buuren, Lady Gaga"
                />
              </Form.Group>
              <Form.Group controlId="registration-receive-email">
                <Form.Label>Emails ontvangen:</Form.Label>
                <Form.Check
                  id="registration-receive-email"
                  defaultChecked={user?.receiveEmail}
                  name="receiveEmail"
                  type="checkbox"
                  label="Emails ontvangen"
                />
              </Form.Group>
              <hr />
              <Form.Group>
                <Form.Label>Wachtwoord:</Form.Label>
                <Form.Control type="password" name="password" placeholder="Wachtwoord" required />
              </Form.Group>
              <Button block className="mt-1" type="submit" id="registration-submit-btn">
                Aanpassen
                <span className="spinner-border spinner-border-sm form-spinner" id="registration-spinner" role="status" />
              </Button>
              <Button
                block
                variant="danger"
                onClick={() => {
                  modalOptions.show = true;
                  modalOptions.callback = () => this.removeAccount();
                  modalOptions.description = "Je account en alle andere informatie wordt verwijderd! Weet je het zeker?";
                  this.setState({ modalOptions });
                }}
                className="mt-1"
                type="button"
              >
                Gegevens verwijderen
                <span className="spinner-border spinner-border-sm form-spinner" id="registration-spinner" role="status" />
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
