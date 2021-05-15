import React, { Component } from "react";
import "./index.css";
import User from "./user-card";
import { GetAllUsers, RemoveUser } from "services/user";
import Loading from "components/shared/loading/";
import Header from "components/shared/header";
import ReactModal from "components/shared/modal/";
import { toast } from "react-toastify";
import { getProfilePictureWithInitials } from "services/shared/user-account-helper";

export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: undefined,
      showModal: false,
      userToRemoveUuid: null,
      modalOptions: {
        description: null,
        show: false,
        callback: () => null,
        close: () => {
          let modalOptions = this.state.modalOptions;
          modalOptions.show = false;
          this.setState({ modalOptions });
        },
      },
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

    for (let user of userList) {
      const age = this.calculateAge(new Date(user.birthDate));

      if (user.hobbies == null) user.hobbies = [];
      if (user.favoriteArtists == null) user.favoriteArtists = [];

      const hobbies = user.hobbies.map((hobby) => (
        <label className="user-hobby" key={hobby.hobby}>
          {hobby.hobby}
        </label>
      ));
      const artists = user.favoriteArtists.map((artist) => (
        <label className="user-artist" key={artist.artist}>
          {artist.artist}
        </label>
      ));

      cards.push(
        <User
          callback={() => {
            let { modalOptions } = this.state;
            modalOptions.show = true;
            modalOptions.callback = () => this.removeUser(user?.uuid);
            modalOptions.description = `Weet je zeker dat je ${user?.username} gebruiker wilt verwijderen?`;
            this.setState({ modalOptions });
          }}
          uuid={user?.uuid}
          key={user?.uuid}
          img={user.avatar ?? getProfilePictureWithInitials(user.username)}
          username={user.username}
          age={age}
          artists={artists}
          hobbies={hobbies}
          about={user.about}
          birthDate={new Date(user.birthDate).toLocaleDateString()}
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

  removeUser = async (uuid) => {
    const result = await RemoveUser(uuid);
    if (result.status === 200) {
      toast.success("Gebruiker verwijderd");
      let cards = this.state.cards;
      cards = cards.filter((card) => card.key !== uuid);
      this.setState({ cards });
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Gebruikers" />
        <ReactModal modalOptions={this.state.modalOptions} />

        <div className="fade-down content">
          <div className="flex-row">{this.state.cards ?? <Loading />}</div>
        </div>
      </div>
    );
  }
}
