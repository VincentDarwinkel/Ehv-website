import "./index.css";
import React, { Component } from "react";
import Header from "components/shared/header";
import Loading from "components/shared/loading";
import { deleteDatepicker, getDatepickers } from "services/datepickers";
import DatepickerCard from "./datepicker-card";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import roles from "services/shared/account-role";
import paths from "services/shared/router-paths";
import { toast } from "react-toastify";
import ReactModal from "components/shared/modal";
import { Button } from "react-bootstrap";

export default class Datepickers extends Component {
  constructor() {
    super();
    this.state = {
      datepickerCards: [],
      modalOptions: {
        title: null,
        description: null,
        action: null,
        showModal: false,
      },
    };
  }

  onDropDownClick = async (dropdownOptions) => {
    if (dropdownOptions.action === "remove") {
      let modalOptions = this.state.modalOptions;
      modalOptions.title = `Weet je zeker dat je ${dropdownOptions.datepickerName} wilt verwijderen`;
      modalOptions.description = `Weet je zeker dat je ${dropdownOptions.datepickerName} wilt verwijderen?`;
      modalOptions.action = () => this.deleteDatepicker(dropdownOptions.uuid);
      modalOptions.showModal = true;
      this.setState({ modalOptions });
    } else if (dropdownOptions.action === "status") {
      window.location = `${paths.DatePickerStatus}#/${dropdownOptions.uuid}`;
    }
  };

  deleteDatepicker = async (uuid) => {
    const result = await deleteDatepicker(uuid);
    if (result.status === 200) {
      toast.success("Datumprikker verwijderd");
      let datepickerCards = this.state.datepickerCards;
      datepickerCards = datepickerCards.filter((dpc) => dpc.key !== uuid);
      this.setState({ datepickerCards });
    }

    let modalOptions = this.state.modalOptions;
    modalOptions.showModal = false;
    this.setState({ modalOptions });
  };

  componentDidMount = async () => {
    const result = await getDatepickers();
    if (result.status === 200) {
      const datepickers = await result.json();
      const datepickerCards = datepickers.map((dp) => <DatepickerCard key={dp.uuid} data={dp} onDropDownClick={this.onDropDownClick} />);
      if (getClaim(jwtClaims.accountRole) === roles.Admin) {
        datepickerCards.unshift(
          <a href={paths.AddDatepicker} id="datepicker-add-card" key="add-datepicker" className="ehv-card all-datepicker-card">
            <i className="fas fa-plus " />
            <br />
            <h3>Datumprikker toevoegen</h3>
          </a>
        );
      }
      this.setState({ datepickerCards });
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Datumprikkers" />
        <ReactModal showModal={this.state.modalOptions.showModal} title={this.state.modalOptions.title} description={this.state.modalOptions.title}>
          <Button variant="danger" onClick={() => this.state.modalOptions.action()}>
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
        <div className="fade-down content">
          <div className="flex-row">{this.state.datepickerCards ?? <Loading />}</div>
        </div>
      </div>
    );
  }
}
