import React, { Component, Suspense } from "react";
import { Button } from "react-bootstrap";
import { getClaim } from "services/jwt";
import accountRole from "services/shared/account-role";
import jwtClaims from "services/shared/jwt-claims";
import "./index.css";

export default class UserCard extends Component {
  userCanBeRemoved = () => {
    if (getClaim(jwtClaims.accountRole) === accountRole.Admin && this.props.accountRole === accountRole.User) {
      return true;
    }
    if (getClaim(jwtClaims.accountRole) === accountRole.SiteAdmin) {
      return true;
    }
    if (this.props.username === getClaim(jwtClaims.userName)) {
      return true;
    }

    return false;
  };

  render() {
    return (
      <div className="user-card ehv-card" key={"user-card" + this.props.id}>
        <img src={this.props.img} alt="user avatar" />
        <h6>
          {this.props.username}
          <br />
        </h6>
        <hr />

        <div className="users-card-info">
          <p>
            &bull; Leeftijd: {this.props.age}
            <br />
            &bull; Verjaardag: {this.props.birthDate}
            <br />
          </p>
        </div>

        <p className="users-card-about">{this.props.about}</p>
        <hr />

        <h6>
          Favoriete artiesten
          <br />
        </h6>
        <div className="users-flexbox-hobbies">{this.props.artists}</div>

        <h6>
          Hobbies
          <br />
        </h6>
        <div className="users-flexbox-hobbies">{this.props.hobbies}</div>
        {this.userCanBeRemoved() ? (
          <Suspense fallback={<div>Loading admin component</div>}>
            <Button onClick={() => this.props.callback()}>Verwijderen</Button>
          </Suspense>
        ) : null}
      </div>
    );
  }
}
