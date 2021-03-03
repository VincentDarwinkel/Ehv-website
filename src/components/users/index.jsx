import React from "react";
import "./index.css";
import { Component } from "react";
import User from "./user-card";
import { GetAllUsers, RemoveUser } from "services/user";
import Loading from "components/shared/loading/";
import Header from "components/shared/header";
import ReactModal from "components/shared/modal/";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getProfilePictureWithInitials } from "services/shared/user-account-helper";

export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: undefined,
      showModal: false,
      userToRemoveUuid: null,
    };
  }

  componentDidMount = async () => {
    const result = await GetAllUsers();
    if (result.status === 200) {
      const userList = await result.json();
      const cards = this.generateUserCards(userList);
      this.setState({ cards });
    }
  };

  generateUserCards = (userList) => {
    let cards = [];

    for (let index = 0; index < userList.length; index++) {
      const user = userList[index];
      const age = this.calculateAge(new Date(user.birthdate));

      if (user.hobbies == null) user.hobbies = [];
      if (user.favoriteArtists == null) user.favoriteArtists = [];

      const hobbies = user.hobbies.map((hobby) => <label key={hobby.hobby}>{hobby.hobby}</label>);
      const artists = user.favoriteArtists.map((artist) => <label key={artist.artist}>{artist.artist}</label>);

      cards.push(
        <User
          callback={() => this.showModal(user?.uuid)}
          uuid={user?.uuid}
          key={user?.uuid}
          img={user.avatar ?? getProfilePictureWithInitials(user.username)}
          username={user.username}
          age={age}
          artists={artists}
          hobbies={hobbies}
          about={user.about}
          birthdate={new Date(user.birthdate).toLocaleDateString()}
        />
      );
    }

    return cards;
  };

  calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  showModal = (uuid) => {
    this.setState({ userToRemoveUuid: uuid, showModal: true });
  };

  removeUser = async () => {
    this.setState({
      showModal: false,
    });

    const uuid = this.state.userToRemoveUuid;
    const result = await RemoveUser(uuid);
    if (result.status === 200) {
      toast.success("Gebruiker verwijderd");
      let cards = this.state.cards;
      cards = cards.filter((card) => card.key !== uuid);
      this.setState({ cards });
      return;
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Gebruikers" />
        <ReactModal showModal={this.state.showModal} title="Gebruiker verwijderen" description="Gebruiker wordt verwijderd">
          <Button variant="danger" onClick={() => this.removeUser()}>
            Verwijderen
          </Button>
          <Button onClick={() => this.setState({ showModal: false })} variant="primary">
            Annuleren
          </Button>
        </ReactModal>
        <div className="fade-down content">
          <div className="flex-row">{this.state.cards ?? <Loading />}</div>
        </div>
      </div>
    );
  }
}
