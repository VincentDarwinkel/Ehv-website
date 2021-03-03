import React, { Component } from "react";
import "./index.css";
import { getFullLocaleDatestring } from "services/shared/time-helper";
import { ProgressBar } from "react-bootstrap";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import roles from "services/shared/account-role";

class EventCard extends Component {
  renderProgressBar = () => {
    if (getClaim(jwtClaims.accountRole) !== roles.User) {
      return null;
    }
    const totalSteps = this.props.totalSteps;
    const completedStepsCount = this.props.completedSteps;
    const progressBarText = completedStepsCount.toString() + " / " + totalSteps.toString() + " voltooid";
    return (
      <div className="mt-2" hidden={totalSteps === 0 ? true : false}>
        <h6>Taken voltooid:</h6>
        <ProgressBar now={completedStepsCount} min={0} max={totalSteps} label={progressBarText} />
      </div>
    );
  };

  render() {
    return (
      <a className="all-event-card ehv-card" href={this.props.href}>
        <div key={this.props.uuid}>
          <h5>{this.props.title}</h5>
          <p>{this.props.description}</p>
          <i className="fas fa-map-marker-alt" /> {this.props.place}
          <br />
          {this.props.dates.map((datetime, index) => (
            <div key={`all-event-card-${index}`}>
              <i className="far fa-calendar-alt" /> {getFullLocaleDatestring(datetime)}
              <br />
            </div>
          ))}
          {this.renderProgressBar()}
          {this.props.buttons}
        </div>
      </a>
    );
  }
}

export default EventCard;
