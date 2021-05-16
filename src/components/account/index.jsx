import React, { Component } from "react";
import "./index.css";
import { GetHobbies } from "services/hobbies";
import { GetArtists } from "services/artists";
import { GetUsersByUuid, UpdateUser } from "services/user";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import Header from "components/shared/header";
import ReactModal from "components/shared/modal";
import { Form, Button } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { createGuid, getFormDataObject } from "services/shared/form-data-helper";
import { toast } from "react-toastify";
import Loading from "components/shared/loading";

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
      formData.favoriteArtists = user.favoriteArtistsl;
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

  render() {
    const { modalOptions, selectableHobbies, selectableArtists, user, selectedArtists, selectedHobbies } = this.state;

    return (
      <div>
        <Header pageName="Account" />
        <ReactModal modalOptions={modalOptions} />
        <div className="fade-down content" id="account">
          {user.email !== undefined ? (
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
                <Button block type="submit" id="registration-submit-btn">
                  Aanpassen
                  <span className="spinner-border spinner-border-sm form-spinner" id="registration-spinner" role="status" />
                </Button>
              </Form>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    );
  }
}

export default Account;
