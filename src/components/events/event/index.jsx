import React, { Component, Suspense } from "react";
import "./index.css";
import { toast } from "react-toastify";
import { GetEventByUuid, SaveEventStepProgress, UnsubscribeFromEventDate, CancelEvent } from "services/events";
import { getClaim } from "services/jwt";
import Header from "components/shared/header";
import { isoToLocale } from "services/shared/time-helper";
import { Button, ListGroup } from "react-bootstrap";
import jwtClaims from "services/shared/jwt-claims";
import ReactModal from "components/shared/modal";
import accountRole from "services/shared/account-role";
import routerPaths from "services/shared/router-paths";
import Loading from "components/shared/loading";

export default class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: null,
      showModal: false,
      userUuid: getClaim(jwtClaims.uuid),
      availableUsers: [],
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
    const result = await GetEventByUuid(window.location.hash.substring(2));
    if (result.status !== 200) {
      return;
    }

    let event = await result.json();
    event.eventSteps.sort((a, b) => (a.stepNr > b.stepNr ? 1 : -1));
    this.setState({ event });
  };

  removeEvent = async () => {
    const result = await CancelEvent(this.state.event.uuid);
    if (result.status !== 200) {
      return;
    }

    toast("Event verwijderd");
    this.setState({ showModal: false });
  };

  displayAvailableUsers = (dateUuid) => {
    const availableUsers = this.state.event?.eventDates
      .find((eventDate) => eventDate.uuid === dateUuid)
      .eventDateUsers?.map((u) => (
        <ListGroup.Item className="event-li fade-down" as="li" key={u.uuid}>
          {u.username}
        </ListGroup.Item>
      ));

    this.setState({ availableUsers });
  };

  unsubscribeFromDate = async (uuid) => {
    const result = await UnsubscribeFromEventDate(uuid);
    if (result.status === 200) {
      toast.success("Afgemeld");
      const eventDates = this.state.event.eventDates.filter((ed) => ed.uuid !== uuid);
      let event = this.state.event;
      event.eventDates = eventDates;

      this.setState({ showModal: false, event });
    }
  };

  onTaskClick = async (stepUuid) => {
    let event = this.state.event;
    let eventStep = event.eventSteps.find((es) => es.uuid === stepUuid);

    const result = await SaveEventStepProgress(stepUuid, !eventStep.completed);
    if (result.status === 200) {
      eventStep.completed = !eventStep.completed;
      this.setState({ event });
    }
  };

  cancelEvent = async () => {
    const result = await CancelEvent(this.state.event.uuid);
    if (result.status === 200) {
      toast.success("Event geannuleerd");
      this.timerHandle = setTimeout(() => {
        window.location = routerPaths.Events;
      }, 5000);
    }
  };

  render() {
    const userAccountRole = getClaim(jwtClaims.accountRole);

    return (
      <div>
        <ReactModal modalOptions={this.state.modalOptions} />
        <Header pageName="Event" />
        {this.state.event?.uuid === null ? <Loading /> : null}
        <div className="content fade-down">
          <div className="card-body event ehv-card">
            <h5 className="event-card-title">{this.state.event?.title}</h5>
            <p>
              <i className="fas fa-map-marker-alt" /> {this.state.event?.location}
              <br />
              {this.state.dateTimeCollection}
              <i className="fas fa-align-left" /> {this.state.event?.description}
            </p>
            <div className="flex-row">
              <ListGroup className="event-list-group" id="event-dates" as="ul">
                <ListGroup.Item as="li" active>
                  <div className="text-white">
                    <i className="fas fa-calendar-day" /> Dagen
                    <br />
                    <small>Klik op een dag om de aanwezigen te weergeven</small>
                  </div>
                </ListGroup.Item>
                {this.state.event?.eventDates.map((date) => (
                  <ListGroup.Item key={date.uuid} className="event-li" as="li">
                    <label className="hover" onClick={() => this.displayAvailableUsers(date.uuid)}>
                      {isoToLocale(date.dateTime).toLocaleString()}
                    </label>
                    <span className="event-dates-unsubscribe-btn-wrapper" hidden={!date.subscribed}>
                      <Button
                        variant="primary"
                        block
                        onClick={() => {
                          let { modalOptions } = this.state;
                          modalOptions.description = "Weet je zeker dat je je wilt afmelden van deze dag?";
                          modalOptions.callback = () => this.unsubscribeFromDate(date.uuid);
                          modalOptions.show = true;
                          this.setState({ modalOptions });
                        }}
                      >
                        Afmelden
                      </Button>
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <ListGroup className="event-list-group" as="ul">
                <ListGroup.Item as="li" active>
                  <div className="text-white">
                    <i className="fas fa-clipboard-list" /> Taken
                  </div>
                </ListGroup.Item>
                {this.state.event?.eventSteps.map((step) => (
                  <ListGroup.Item
                    style={{ cursor: "pointer" }}
                    key={step.uuid}
                    onClick={() => {
                      if (userAccountRole === accountRole.User) {
                        this.onTaskClick(step.uuid);
                      }
                    }}
                    className="event-li"
                    as="li"
                  >
                    <i className="fas fa-check" hidden={!step.completed} />
                    <span className="event-task-description">{step.text}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <ListGroup className="event-list-group">
                <ListGroup.Item as="li" active>
                  <i className="fas fa-user-friends text-white" /> Aanwezigen
                </ListGroup.Item>
                {this.state.availableUsers}
              </ListGroup>
            </div>

            {this.state.event?.canBeRemoved ? (
              <Suspense fallback={<div>Loading admin component</div>}>
                <Button
                  variant="secondary"
                  block
                  className="mt-4"
                  onClick={() => {
                    let { modalOptions } = this.state;
                    modalOptions.description = "Weet je zeker dat je het event wilt annuleren?";
                    modalOptions.show = true;
                    modalOptions.callback = this.cancelEvent;
                    this.setState({ modalOptions });
                  }}
                >
                  Annuleren
                </Button>
              </Suspense>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
