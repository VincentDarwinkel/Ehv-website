import "./index.css";
import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { createGuid, getFormData, stringIsNullOrEmpty } from "services/shared/form-data-helper";
import { isoToLocale, localeToISO } from "services/shared/time-helper";
import ReactModal from "components/shared/modal";

export default class DatepickerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSelectors: [],
      modalOptions: {
        showModal: false,
        title: null,
        description: null,
        modalAction: null,
      },
    };
  }

  componentDidMount = () => {
    if (this.props.data?.uuid === undefined) {
      this.addDateSelector();
      return;
    }

    this.props.data.dates.forEach((date) => {
      const dateTimeSeparated = this.getDateTimeSeparated(date.dateTime);
      date.date = dateTimeSeparated.date;
      date.time = dateTimeSeparated.time;
      this.addDateSelector(date);
    });
  };

  getFormData = () => {
    let formData = getFormData("datepicker-form");
    formData.uuid = this.props.data?.uuid;
    formData.expires = localeToISO(`${formData.expiresDate}T${formData.expiresTime}`);
    formData.dates = [];

    this.state.dateSelectors.forEach((ds) => {
      const date = document.getElementById(`date-${ds.key}`).value;
      const time = document.getElementById(`time-${ds.key}`).value;
      const dateTime = localeToISO(`${date}T${time}`);
      const uuid = this.props.data?.dates.find((d) => d.uuid === ds.key)?.uuid;

      formData.dates.push({
        uuid,
        dateTime,
        datepickerUuid: this.props.data?.uuid,
      });
    });

    return formData;
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const formData = this.getFormData();
    await this.props.onSubmit(formData);
  };

  getDateTimeSeparated = (providedDate) => {
    const localDate = isoToLocale(providedDate);
    const year = localDate.getFullYear();
    const month = `${localDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${localDate.getDate()}`.padStart(2, "0");
    const time = localDate.toLocaleTimeString();
    const date = [year, month, day].join("-");

    return {
      date,
      time,
    };
  };

  getDefaultExpirationDate = () => {
    const today = new Date();
    const defaultExpirationDate = new Date(today.setMonth(today.getMonth() + 1));
    return this.getDateTimeSeparated(defaultExpirationDate);
  };

  removeSelector = (uuid) => {
    let dateSelectors = this.state.dateSelectors;
    const indexOfSelector = dateSelectors.findIndex((ds) => ds.key === uuid);

    if (indexOfSelector !== -1) {
      dateSelectors.splice(indexOfSelector, 1);
    }
    this.setState({ dateSelectors });
  };

  addDateSelector = (data = null) => {
    let dateSelectors = this.state.dateSelectors;
    const uuid = data !== null ? data.uuid : createGuid();

    dateSelectors.push(
      <Form.Group key={uuid}>
        <Form.Control defaultValue={data?.date} required id={`date-${uuid}`} type="date" className="datepicker-form-expires" />
        <Form.Control defaultValue={data?.time} required id={`time-${uuid}`} type="time" className="datepicker-form-expires" />
        {this.state.dateSelectors.length > 0 ? (
          <Button
            onClick={() => {
              if (data === null) {
                this.removeSelector(uuid);
                return;
              }

              let modalOptions = this.state.modalOptions;
              modalOptions.modalAction = () => this.removeSelector(uuid);
              modalOptions.title = "Verwijderen dag";
              modalOptions.description =
                "Waarschuwing als je deze dag verwijderd worden alle beschikbaarheden " +
                "die zijn opgegeven verwijderd en krijgen gebruikers die op deze datumprikker hebben gereageerd een melding. Weet je zeker dat je wilt doorgaan?";
              modalOptions.showModal = true;
              this.setState({ modalOptions });
            }}
            variant="primary"
            className="mb-1 ml-1"
          >
            <i className="fas fa-times" />
          </Button>
        ) : null}
      </Form.Group>
    );

    this.setState({ dateSelectors });
  };

  setExpirationDate = () => {
    if (this.props.data?.expires === undefined) {
      return;
    }
    const expirationDate = new Date(this.props.data?.expires).toISOString();
    const indexOfTimeString = expirationDate.indexOf("T");
    return expirationDate.substring(0, indexOfTimeString);
  };

  render() {
    return (
      <div>
        <ReactModal
          showModal={this.state.modalOptions.showModal}
          title={this.state.modalOptions.title}
          description={this.state.modalOptions.description}
        >
          <Button
            variant="danger"
            onClick={() => {
              let modalOptions = this.state.modalOptions;
              modalOptions.modalAction();
              modalOptions.showModal = false;
              this.setState({ modalOptions });
            }}
          >
            Verwijderen
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              let modalOptions = this.state.modalOptions;
              modalOptions.showModal = false;
              this.setState({ modalOptions });
            }}
          >
            Annuleren
          </Button>
        </ReactModal>
        <div className="ehv-card" id="datepicker-form-wrapper">
          <Form onSubmit={this.onSubmit} id="datepicker-form">
            <Form.Group>
              <Form.Label>Titel:</Form.Label>
              <Form.Control defaultValue={this.props.data?.title} required name="title" placeholder="Stappen" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Beschrijving:</Form.Label>
              <Form.Control
                defaultValue={this.props.data?.description}
                required
                name="description"
                placeholder="Eerst naar Villa Fiest dan naar Silent disco"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Locatie:</Form.Label>
              <Form.Control defaultValue={this.props.data?.location} required name="location" placeholder="Eindhoven | Stratum" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Verloopt:</Form.Label>
              <br />
              <Form.Control
                required
                defaultValue={stringIsNullOrEmpty(this.props.data?.expires) ? this.getDefaultExpirationDate().date : this.setExpirationDate()}
                name="expiresDate"
                type="date"
                className="datepicker-form-expires"
              />
              <Form.Control
                required
                defaultValue={stringIsNullOrEmpty(this.props.data?.expires) ? this.getDateTimeSeparated().time : "18:00"}
                name="expiresTime"
                type="time"
                className="datepicker-form-expires"
              />
            </Form.Group>
            <Form.Group>
              <Button type="button" onClick={() => this.addDateSelector()} variant="primary" className="mt-1">
                <i className="fas fa-plus" /> Dagen Toevoegen
              </Button>
            </Form.Group>
            <div>{this.state.dateSelectors}</div>
            <Button block type="submit" variant="primary">
              {this.props.data?.uuid !== undefined ? "Aanpassen" : "Aanmaken"}
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
