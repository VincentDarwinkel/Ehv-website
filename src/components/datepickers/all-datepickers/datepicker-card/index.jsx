import "./index.css";
import React, { Component } from "react";
import { getFullLocaleDatestring } from "services/shared/time-helper";
import paths from "services/shared/router-paths";
import { Dropdown } from "react-bootstrap";
import { Suspense } from "react";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import roles from "services/shared/account-role";

export default class DatepickerCard extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
    };
  }

  getDropDownMenu = () => {
    return (
      <Suspense fallback={<div>Loading admin component</div>}>
        <Dropdown className="all-datepicker-card-dropdown">
          <Dropdown.Toggle variant="primary">
            <li className="fas fa-pen" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() =>
                this.props.onDropDownClick({
                  action: "status",
                  uuid: this.props.data?.uuid,
                  datepickerName: this.props.data?.title,
                })
              }
            >
              <i className="fas fa-info-circle" /> Status
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                this.props.onDropDownClick({
                  action: "remove",
                  uuid: this.props.data?.uuid,
                  datepickerName: this.props.data?.title,
                })
              }
            >
              <i className="fas fa-times" /> Verwijderen
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Suspense>
    );
  };

  render() {
    const accountRole = jwtClaims.accountRole;
    const href = accountRole === roles.Admin ? paths.EditDatepicker : paths.DatePickerAvailability;
    return (
      <div className="all-datepicker-card ehv-card">
        {this.props.data?.canBeRemoved && accountRole === roles.Admin ? this.getDropDownMenu() : null}
        <a href={href + "#/" + this.props.data.uuid}>
          <div>
            <h5>{this.props.data.title}</h5>
            <p>{this.props.data.description}</p>
            <i className="fas fa-map-marker-alt" /> {this.props.data.location}
            <br />
            {this.props.data.dates.map((date, index) => (
              <div key={`all-date-card-${index}`}>
                <i className="far fa-calendar-alt" /> {getFullLocaleDatestring(date.dateTime)}
                <br />
              </div>
            ))}
          </div>
        </a>
      </div>
    );
  }
}
