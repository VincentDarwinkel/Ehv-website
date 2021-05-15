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
import EmptyFolder from "components/shared/empty-folder";

export default class Datepickers extends Component {
  constructor() {
    super();
    this.state = {
      datepickerCards: [],
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

  onDropDownClick = async (dropdownOptions) => {
    if (dropdownOptions.action === "remove") {
      let { modalOptions } = this.state;
      modalOptions.show = true;
      modalOptions.callback = () => this.deleteDatepicker(dropdownOptions.uuid);
      modalOptions.description = `Weet je zeker dat je ${dropdownOptions.datepickerName} wilt verwijderen`;
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
  };

  componentDidMount = async () => {
    const result = await getDatepickers();
    if (result.status === 200) {
      const datepickers = await result.json();
      let datepickerCards = datepickers.map((dp) => <DatepickerCard key={dp.uuid} data={dp} onDropDownClick={this.onDropDownClick} />);
      const userAccountRole = getClaim(jwtClaims.accountRole);
      if (userAccountRole === roles.Admin) {
        datepickerCards.unshift(
          <a href={paths.AddDatepicker} id="datepicker-add-card" key="add-datepicker" className="ehv-card all-datepicker-card">
            <i className="fas fa-plus " />
            <br />
            <h3>Datumprikker toevoegen</h3>
          </a>
        );
      } else if (datepickers?.length === 0 && userAccountRole === roles.User) {
        datepickerCards = <EmptyFolder />;
      }
      this.setState({ datepickerCards });
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Datumprikkers" />
        <ReactModal modalOptions={this.state.modalOptions} />

        <div className="fade-down content">
          <div className="flex-row">{this.state.datepickerCards ?? <Loading />}</div>
        </div>
      </div>
    );
  }
}
