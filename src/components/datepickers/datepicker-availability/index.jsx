import "./index.css";
import React, { Component } from "react";
import Header from "components/shared/header";
import { getDatepicker, saveAvailability } from "services/datepickers";
import { getFullLocaleDatestring } from "services/shared/time-helper";
import { Button, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";

export default class DatepickerAvailability extends Component {
  constructor() {
    super();
    this.state = {
      datepicker: null,
      availableDates: [],
    };
  }

  componentDidMount = async () => {
    const uuid = window.location.hash.substring(2);
    const result = await getDatepicker(uuid);
    if (result.status === 200) {
      const datepicker = await result.json();
      const userUuid = getClaim(jwtClaims.uuid);
      const availableDates = datepicker.dates
        .filter((date) => date.userAvailabilities.some((ua) => ua.userUuid === userUuid))
        .map((date) => date.uuid);

      this.setState({ datepicker, availableDates });
    }
  };

  onDateClick = (dateUuid) => {
    let availableDates = this.state.availableDates;
    const date = availableDates.find((ad) => ad === dateUuid);
    if (date === undefined) {
      availableDates.push(dateUuid);
    } else {
      const indexOf = availableDates.findIndex((ad) => ad === dateUuid);
      if (indexOf !== -1) {
        availableDates.splice(indexOf, 1);
      }
    }

    this.setState({ availableDates });
  };

  onSubmit = async () => {
    const availabilities = this.state.availableDates;
    const result = await saveAvailability(availabilities, this.state.datepicker.uuid);
    if (result.status === 200) {
      toast.success("Beschikbaarheid opgeslagen");
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Beschikbaarheid" />
        <div className="content fade-up" id="datepicker-availability">
          <div className="ehv-card">
            <h5>{this.state.datepicker?.title}</h5>
            <p>{this.state.datepicker?.description}</p>
            <i className="fas fa-map-marker-alt" /> {this.state.datepicker?.location}
            <hr />
            <h5>Beschikbaarheid</h5>
            <small>Geef hieronder aan of je beschikbaar bent op de datum, klik op een datum om hem op beschikbaar te zetten</small>
            <ListGroup className="mt-3">
              <ListGroup.Item active>Dagen</ListGroup.Item>
              {this.state.datepicker?.dates?.map((date) => (
                <ListGroup.Item onClick={() => this.onDateClick(date.uuid)} className="noselect" key={date.uuid} style={{ cursor: "pointer" }}>
                  {
                    <div>
                      <i className="fas fa-check" hidden={!this.state.availableDates.some((ad) => ad === date.uuid)} />{" "}
                      {getFullLocaleDatestring(date.dateTime)}
                    </div>
                  }
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button onClick={() => this.onSubmit()} variant="primary" block className="mt-2">
              <i className="fas fa-cloud-upload-alt" /> Opslaan
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
