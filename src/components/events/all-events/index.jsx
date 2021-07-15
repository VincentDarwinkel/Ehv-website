import React, { Component } from "react";
import { GetAllEvents } from "services/events";
import { getClaim } from "services/jwt";
import EmptyFolder from "components/shared/empty-folder";
import Header from "components/shared/header";
import EventCard from "./event-card";
import jwtClaims from "services/shared/jwt-claims";
import routerPaths from "services/shared/router-paths";

export default class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventCards: null,
    };
  }

  componentDidMount = async () => {
    const result = await GetAllEvents();
    if (result.status === 200) {
      const events = await result.json();
      if (events.length !== 0) {
        this.renderEventCards(events);
      } else {
        this.setState({ eventCards: <EmptyFolder /> });
      }
    }
  };

  renderEventCards = (events = []) => {
    let eventCards = [];

    const userUuid = getClaim(jwtClaims.uuid);
    let completedSteps = 0;

    events.forEach((event) => {
      event.eventSteps.forEach((step) => {
        step.eventStepUsers.forEach((stepUser) => {
          if (stepUser.userUuid === userUuid) {
            completedSteps++;
          }
        });
      });

      eventCards.push(
        <EventCard
          key={event.uuid}
          title={event.title}
          completedSteps={completedSteps}
          totalSteps={event.eventSteps.length}
          place={event.location}
          dates={event.eventDates.map((date) => date.dateTime)}
          href={routerPaths.Event + "#/" + event.uuid}
        />
      );
    });

    this.setState({ eventCards: eventCards });
  };

  generateAdminPanel = () => {
    if (getClaim("AccountRole") === "Admin") {
      let items = [];
      items.push(
        <a className="btn" id="events-dashboard-new-btn" href="events/new">
          Nieuw <i className="fas fa-plus" />
        </a>
      );
      this.setState({ adminPanel: items });
    }
  };

  render() {
    return (
      <div>
        <Header loading={this.state.eventCards === null} pageName="Events" />
        <div className="fade-down content">
          <div className="flex-row">{this.state.eventCards}</div>
        </div>
      </div>
    );
  }
}
