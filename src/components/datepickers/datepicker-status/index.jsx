import React, { Component } from "react";
import Header from "components/shared/header";
import { getDatepicker } from "services/datepickers";
import { getFullLocaleDatestring } from "services/shared/time-helper";
import { GetUsersByUuid } from "services/user";
import "./index.css";
import { createGuid, getFormData, stringIsNullOrEmpty } from "services/shared/form-data-helper";
import ReactTooltip from "react-tooltip";
import CustomProgressBar from "components/shared/progress-bar";
import { Button, Form, ListGroup } from "react-bootstrap";
import ReactModal from "components/shared/modal";
import { ConvertDatepickerToEvent } from "services/events";
import { toast } from "react-toastify";
import paths from "services/shared/router-paths";

export default class DatepickerStatus extends Component {
  constructor() {
    super();
    this.state = {
      datepicker: null,
      availableUsers: [],
      selectedDatesUuid: [],
      steps: [],
      showModal: false,
    };
  }

  sortDatesByAvailableUsers = (a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };

  componentDidMount = async () => {
    const uuid = window.location.hash.substring(2);
    const result = await getDatepicker(uuid);
    if (result.status === 200) {
      let datepicker = await result.json();
      datepicker?.dates.sort((a, b) => this.sortDatesByAvailableUsers(b?.userAvailabilities?.length, a?.userAvailabilities?.length));

      let availableUsersInDatepicker = [];
      datepicker.dates.forEach((date) => {
        availableUsersInDatepicker = availableUsersInDatepicker.concat(date.userAvailabilities.map((ua) => ua.userUuid));
      });
      this.setState({ datepicker });

      const usersUuidCollection = [...new Set([...availableUsersInDatepicker])]; // remove duplicates
      const userResult = await GetUsersByUuid(usersUuidCollection);
      if (userResult.status === 200) {
        const availableUsers = await userResult.json();
        this.setState({ availableUsers });
      }
    }
  };

  componentWillUnmount = () => {
    if (this.timerHandle) {
      // remove timeout to prevent memory leak
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  };

  setSelectedDate = (dateUuid) => {
    let selectedDates = this.state.selectedDatesUuid;
    const indexOf = selectedDates.findIndex((sdUuid) => sdUuid === dateUuid);
    if (indexOf === -1) {
      selectedDates.push(dateUuid);
    } else {
      selectedDates.splice(indexOf, 1);
    }

    this.setState({ selectedDates });
  };

  calculateProgressBarPercentage = (date) => {
    if (this.state.availableUsers.length === 0) {
      return 0;
    }
    const result = Math.round((100 / this.state.availableUsers?.length) * date?.userAvailabilities?.length);
    return result;
  };

  getFormData = () => {
    const formData = getFormData("datepicker-conversion-form");
    const formDataArray = Object.keys(formData);
    return {
      datepickerUuid: this.state.datepicker.uuid,
      selectedDatesUuid: this.state.selectedDatesUuid,
      eventSteps: formDataArray?.map((key, index) => ({ stepNr: index, text: formData[key] })),
    };
  };

  validateFormData = () => {
    if (this.state.selectedDatesUuid?.length <= 0) {
      toast.error("Er zijn geen dagen geselecteerd");
      return false;
    }
    return true;
  };

  convertDatepickerToEvent = async () => {
    this.setState({ showModal: false });
    const datepickerConversionModel = this.getFormData();
    if (!this.validateFormData()) {
      return;
    }

    const result = await ConvertDatepickerToEvent(datepickerConversionModel);
    if (result.status === 200) {
      toast.success("Datumprikker omgezet");
      document.getElementById("datepicker-status-submit-btn").disabled = true;

      this.timerHandle = setTimeout(() => {
        window.location = paths.Events;
      }, 5000);
    }
  };

  getSelectedDatesOverview = () => {
    return this.state.selectedDatesUuid.map((dateUuid) => {
      const date = this.state.datepicker.dates.find((d) => d.uuid === dateUuid);
      return <ListGroup.Item key={`${dateUuid}-selected`}>{getFullLocaleDatestring(date.dateTime)}</ListGroup.Item>;
    });
  };

  onDateClick = (date) => {
    const card = document.getElementById(date.uuid);
    const backgroundColor = card.style.backgroundColor;
    if (backgroundColor === "rgb(59, 90, 148)" || stringIsNullOrEmpty(backgroundColor)) {
      card.style.backgroundColor = "rgb(200, 200, 200)";
      card.style.color = "black";
    } else {
      card.style.backgroundColor = "rgb(59, 90, 148)";
      card.style.color = "white";
    }
    this.setSelectedDate(date.uuid);
  };

  render() {
    return (
      <div>
        <Header pageName="Datumprikker status" />
        <ReactModal
          showModal={this.state.showModal}
          title="Datumprikker omzetten"
          description="Weet je zeker dat je de datumprikker wilt omzetten naar een event?"
        >
          <Button variant="danger" onClick={() => this.convertDatepickerToEvent()}>
            Omzetten
          </Button>
          <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>
            Annuleren
          </Button>
        </ReactModal>
        <div className="content">
          {this.state.datepicker?.dates?.map((date) => (
            <div className="ehv-card-no-padding mb-2 noselect" key={date.uuid} id={date.uuid} style={{ cursor: "pointer" }}>
              <div onClick={() => this.onDateClick(date)} className="p-4">
                <h5>{getFullLocaleDatestring(date.dateTime)}</h5>
                <b>Beschikbare gebruikers:</b>
                <br />
              </div>
              <div className="ml-4 mr-4">
                {date.userAvailabilities.map((ua) => {
                  const user = this.state.availableUsers.find((au) => au.uuid === ua.userUuid);
                  return (
                    <div
                      data-tip={user?.username ?? "Gebruikersnaam"}
                      data-place="bottom"
                      data-delay-show="75"
                      key={`${ua.username}-available-user`}
                      className="d-inline-block m-1"
                    >
                      {stringIsNullOrEmpty(user?.avatar) ? (
                        user?.username
                      ) : (
                        <img alt="Profielafbeelding" className="datepicker-status-user-avatar" src={user?.avatar} />
                      )}
                      <ReactTooltip />
                    </div>
                  );
                })}
              </div>
              <div onClick={() => this.onDateClick(date)} className="p-4">
                <CustomProgressBar
                  className="mt-2"
                  backgroundColor="whitesmoke"
                  value={this.calculateProgressBarPercentage(date)}
                  text={`${this.calculateProgressBarPercentage(date)}% beschikbaar`}
                />
              </div>
            </div>
          ))}
          <div className="mt-3 ehv-card">
            <h4>Datumprikker omzetten naar event</h4>
            <p>
              Zet de datumprikker om naar een event. Hierdoor kunnen gebruikers zich niet meer aanmelden. Als de datumprikker verlooptijd is
              verstreken wordt het automatisch omgezet naar een event. Als een datumprikker automatisch is omgezet is het niet meer mogelijk om
              stappen toe te voegen of te wijzigen.
            </p>
            <h5>Stappen toevoegen:</h5>
            <small>
              Gebruikers krijgen een overzicht van stappen die moeten worden voltooid zodat die persoon voorbereid bij het event kan aansluiten.
              Stappen toevoegen is optioneel
            </small>
            <Form id="datepicker-conversion-form">
              <div className="mt-2">{this.state.steps}</div>
              <Button
                disabled={this.state.datepicker?.uuid === undefined}
                variant="primary"
                onClick={() => {
                  let steps = this.state.steps;
                  const uuid = createGuid();
                  steps.push(
                    <Form.Group className="datepicker-status-step" key={uuid}>
                      <Form.Control name={uuid} className="d-inline-block" placeholder="stap" />
                      <Button
                        onClick={() => {
                          let st = this.state.steps;
                          const indexOf = st.findIndex((s) => s.key === uuid);
                          if (indexOf !== -1) {
                            steps.splice(indexOf, 1);
                            this.setState({ st });
                          }
                        }}
                        className="d-inline-block mb-1"
                      >
                        <i className="fas fa-times" />
                      </Button>
                    </Form.Group>
                  );

                  this.setState({ steps });
                }}
              >
                <i className="fas fa-plus" /> Stap toevoegen
              </Button>
            </Form>
            <h5 className="mt-2">Geselecteerde dagen:</h5>
            <ListGroup>{this.getSelectedDatesOverview()}</ListGroup>
            <Button
              disabled={this.state.datepicker?.uuid === undefined}
              id="datepicker-status-submit-btn"
              onClick={() => this.setState({ showModal: true })}
              variant="primary"
              block
              className="mt-3"
            >
              <i className="fas fa-random" /> Datumprikker omzetten
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
