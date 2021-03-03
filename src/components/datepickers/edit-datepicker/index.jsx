import React, { Component } from "react";
import Header from "components/shared/header";
import { editDatepicker, getDatepicker } from "services/datepickers";
import { toast } from "react-toastify";
import DatepickerForm from "../datepicker-form";
import { stringIsNullOrEmpty } from "services/shared/form-data-helper";
import Loading from "components/shared/loading";

export default class EditDatepicker extends Component {
  constructor() {
    super();
    this.state = {
      datepicker: null,
    };
  }

  componentDidMount = async () => {
    const uuid = window.location.hash.substring(2);
    if (stringIsNullOrEmpty(uuid)) {
      toast.error("Geen unieke waarde meegeven, data kan niet worden weergeven");
      return;
    }

    const result = await getDatepicker(uuid);
    if (result.status === 200) {
      const datepicker = await result.json();
      this.setState({ datepicker });
    }
  };

  onSubmit = async (formData) => {
    const result = await editDatepicker(formData);
    if (result.status === 200) {
      toast.success("Datumprikker aangepast");
      return;
    } else if (result.status === 409) {
      toast.error("Er bestaat al een datumprikker met deze naam, kies een andere naam");
      return;
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Datumprikkers" />
        <div className="content">
          {this.state.datepicker?.uuid === undefined ? <Loading /> : <DatepickerForm data={this.state.datepicker} onSubmit={this.onSubmit} />}
        </div>
      </div>
    );
  }
}
